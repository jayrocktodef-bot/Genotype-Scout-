import gzip
import json
import logging
from pathlib import Path
from typing import Dict, Any

logger = logging.getLogger("schema_formatter")


class GenotypeScoutSchemaFormatter:
    """
    Formats and exports the converted Indigenous Latin American WGS reference matrix
    into Genotype Scout JSON & compressed binary formats.
    """

    def __init__(self, dataset_config: Dict[str, Any], output_dir: str = "./dist"):
        self.dataset_config = dataset_config
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def export_reference_matrix(
        self,
        snps_data: Dict[str, Dict[str, Any]],
        output_filename: str = "latin_america_wgs_reference.json",
        compress_binary: bool = True
    ) -> Path:
        """
        Exports formatted reference data to JSON and optional compressed gzipped binary format.
        """
        output_path = self.output_dir / output_filename

        metadata = {
            "dataset_accession": self.dataset_config.get("dataset_info", {}).get("dataset_accession", "EGAD50000002396"),
            "study_accession": self.dataset_config.get("dataset_info", {}).get("study_accession", "EGAS50000001664"),
            "dac_accession": self.dataset_config.get("dataset_info", {}).get("dac_accession", "EGAC50000000368"),
            "genome_builds": ["GRCh38", "GRCh37"],
            "sample_count": self.dataset_config.get("dataset_info", {}).get("sample_count", 128),
            "subpopulation_count": self.dataset_config.get("dataset_info", {}).get("population_count", 45),
            "linguistic_families": self.dataset_config.get("dataset_info", {}).get("linguistic_families", 28),
            "regional_clusters": self.dataset_config.get("regional_clusters", []),
            "total_snps": len(snps_data)
        }

        full_payload = {
            "_metadata": metadata,
            "snps": snps_data
        }

        # Write JSON formatted reference
        with open(output_path, "w") as f:
            json.dump(full_payload, f, indent=2)
        logger.info(f"Successfully exported Genotype Scout reference JSON to {output_path}")

        # Compress to binary gzipped JSON if requested
        if compress_binary:
            binary_path = self.output_dir / output_filename.replace(".json", ".bin.gz")
            raw_bytes = json.dumps(full_payload).encode("utf-8")
            with gzip.open(binary_path, "wb") as gz:
                gz.write(raw_bytes)
            logger.info(f"Successfully exported compressed binary matrix to {binary_path}")

        return output_path
