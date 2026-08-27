import math
import json
import logging
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any

logger = logging.getLogger("vcf_matrix_converter")


class VCFReferenceMatrixConverter:
    """
    Processes multi-sample VCF files from EGAD50000002396, filters them to target consumer SNP array panels,
    calculates subpopulation allele frequencies across 45 Indigenous groups, and computes Fst / LLR weight matrices.
    """

    def __init__(
        self,
        samples_metadata: Dict[str, Dict[str, Any]],
        dataset_config: Dict[str, Any],
        output_dir: str = "./dist"
    ):
        self.samples_metadata = samples_metadata
        self.dataset_config = dataset_config
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.epsilon = dataset_config.get("filtering_parameters", {}).get("pseudo_count_epsilon", 1e-4)

        # Build lookup maps: sample_id -> population, sample_id -> region
        self.sample_to_pop = {sid: meta["population"] for sid, meta in samples_metadata.items()}
        self.sample_to_region = {sid: meta["regional_cluster"] for sid, meta in samples_metadata.items()}

        # Group sample indices/IDs by population
        self.pop_to_samples: Dict[str, List[str]] = {}
        for sid, pop in self.sample_to_pop.items():
            self.pop_to_samples.setdefault(pop, []).append(sid)

        # Group sample indices/IDs by regional cluster
        self.region_to_samples: Dict[str, List[str]] = {}
        for sid, reg in self.sample_to_region.items():
            self.region_to_samples.setdefault(reg, []).append(sid)

    def calculate_bayesian_shrunk_frequency(self, alt_count: int, total_alleles: int, alpha: float = 1.0) -> float:
        """
        Applies Bayesian Laplace shrinkage / pseudocount to small sample populations (e.g. n=2-3 samples):
        p_shrunk = (MAC + alpha) / (NCHROBS + 2*alpha)
        """
        if total_alleles == 0:
            return 0.0
        shrunk_p = (alt_count + alpha) / (total_alleles + 2 * alpha)
        return round(shrunk_p, 4)

    def calculate_hudson_fst(self, p1: float, p2: float, n1: int, n2: int) -> float:
        """
        Computes Hudson's Fst estimator for pairwise population comparisons,
        which is unbiased for small sample sizes:
        Fst = [(p1 - p2)^2 - p1(1-p1)/(2n1-1) - p2(1-p2)/(2n2-1)] / [p1(1-p2) + p2(1-p1)]
        """
        if n1 <= 1 or n2 <= 1:
            return 0.0

        num = (p1 - p2) ** 2 - (p1 * (1 - p1) / (2 * n1 - 1)) - (p2 * (1 - p2) / (2 * n2 - 1))
        den = p1 * (1 - p2) + p2 * (1 - p1)

        if abs(den) < 1e-12:
            return 0.0

        fst = num / den
        return max(0.0, min(1.0, fst))

    def calculate_fst(self, pop_freqs: Dict[str, float], pop_sizes: Optional[Dict[str, int]] = None) -> float:
        """
        Calculates average Hudson Fst across pairwise population combinations if sample sizes are provided,
        or Wright's Fst as a general fallback.
        """
        if not pop_freqs or len(pop_freqs) <= 1:
            return 0.0

        if pop_sizes:
            pops = list(pop_freqs.keys())
            fst_sum = 0.0
            pair_count = 0
            for i in range(len(pops)):
                for j in range(i + 1, len(pops)):
                    p1, p2 = pop_freqs[pops[i]], pop_freqs[pops[j]]
                    n1, n2 = pop_sizes.get(pops[i], 2), pop_sizes.get(pops[j], 2)
                    fst_sum += self.calculate_hudson_fst(p1, p2, n1, n2)
                    pair_count += 1
            return round(fst_sum / pair_count, 4) if pair_count > 0 else 0.0

        p_vals = list(pop_freqs.values())
        k = len(p_vals)
        p_bar = sum(p_vals) / k
        Ht = 2 * p_bar * (1 - p_bar)
        if Ht <= 1e-12:
            return 0.0

        Hs = sum(2 * p * (1 - p) for p in p_vals) / k
        fst = (Ht - Hs) / Ht
        return max(0.0, min(1.0, fst))

    def calculate_llr_weight(self, sub_freq: float, baseline_freq: float) -> float:
        """
        Computes Log-Likelihood Ratio (LLR) weight for an allele in a subpopulation relative
        to a global/East-Asian baseline panel to avoid misattribution of private alleles:
        LLR = ln((f_sub + epsilon) / (f_baseline + epsilon))
        """
        num = sub_freq + self.epsilon
        den = baseline_freq + self.epsilon
        return round(math.log(num / den), 4)

    def process_vcf_records(self, vcf_records: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
        """
        Processes a list of VCF variant records dictionary representation.
        Expects records containing:
          - rsid: str
          - chr: str
          - pos_grch38: int
          - pos_grch37: int
          - ref: str
          - alt: str
          - genotypes: Dict[sample_id, str] e.g. {"EGAS1664_IND_001": "0/1", ...}
          - global_baseline_freq: float (optional, default 0.05)
        """
        result_snps = {}

        for rec in vcf_records:
            rsid = rec.get("rsid", "").lower().strip()
            if not rsid:
                rsid = f"chr{rec['chr']}_{rec['pos_grch38']}"

            genotypes = rec.get("genotypes", {})
            baseline_freq = rec.get("global_baseline_freq", 0.05)

            # Compute subpopulation frequencies
            sub_freqs: Dict[str, float] = {}
            for pop, samples in self.pop_to_samples.items():
                alt_count = 0
                total_alleles = 0
                for sid in samples:
                    g = genotypes.get(sid, "./.")
                    if g in ["0/0", "0|0"]:
                        total_alleles += 2
                    elif g in ["0/1", "1/0", "0|1", "1|0"]:
                        alt_count += 1
                        total_alleles += 2
                    elif g in ["1/1", "1|1"]:
                        alt_count += 2
                        total_alleles += 2

                freq = round(alt_count / total_alleles, 4) if total_alleles > 0 else 0.0
                sub_freqs[pop] = freq

            # Compute regional cluster frequencies
            regional_freqs: Dict[str, float] = {}
            for reg, samples in self.region_to_samples.items():
                alt_count = 0
                total_alleles = 0
                for sid in samples:
                    g = genotypes.get(sid, "./.")
                    if g in ["0/0", "0|0"]:
                        total_alleles += 2
                    elif g in ["0/1", "1/0", "0|1", "1|0"]:
                        alt_count += 1
                        total_alleles += 2
                    elif g in ["1/1", "1|1"]:
                        alt_count += 2
                        total_alleles += 2

                freq = round(alt_count / total_alleles, 4) if total_alleles > 0 else 0.0
                regional_freqs[reg] = freq

            # Compute global Fst across populations
            fst_global = round(self.calculate_fst(sub_freqs), 4)

            # Compute LLR weights per regional cluster vs baseline
            llr_weights: Dict[str, float] = {}
            for reg, r_freq in regional_freqs.items():
                llr_weights[reg] = self.calculate_llr_weight(r_freq, baseline_freq)

            result_snps[rsid] = {
                "chr": str(rec.get("chr", "")),
                "pos_grch38": rec.get("pos_grch38", 0),
                "pos_grch37": rec.get("pos_grch37", 0),
                "ref": rec.get("ref", ""),
                "alt": rec.get("alt", ""),
                "fst_global": fst_global,
                "regionalFrequencies": regional_freqs,
                "subFrequencies": sub_freqs,
                "llr_weights": llr_weights
            }

        logger.info(f"Processed {len(result_snps)} variants into reference matrix format.")
        return result_snps
