/**
 * strandMatcher.ts
 * Unified DNA strand matching policy for WITG-Genotype-Scout.
 *
 * Rules:
 * 1. Exact forward match counts first.
 * 2. Reverse-complement match is attempted ONLY on non-match AND NEVER on palindromic SNPs (A/T, C/G).
 *    Palindromic SNPs must strictly match forward strand only to prevent ambiguous reverse-strand miscalls.
 * 3. Case-insensitive comparison.
 */

export interface StrandMatchResult {
  /** Count of target alleles in the user's genotype (e.g. 0, 1, or 2) */
  dosage: number;
  /** Whether complement matching was used to resolve any allele */
  isComplement: boolean;
  /** Whether the SNP is classified as palindromic (A/T or C/G) */
  isPalindromic: boolean;
  /** Raw matching details for debugging and audit */
  allelesMatched: string[];
}

/**
 * Returns the Watson-Crick complement of a single nucleotide base.
 */
export function complementBase(base: string): string {
  switch (base.toUpperCase()) {
    case 'A': return 'T';
    case 'T': return 'A';
    case 'C': return 'G';
    case 'G': return 'C';
    default: return base;
  }
}

/**
 * Checks whether an allele pair forms a palindromic (A/T or C/G) SNP.
 */
export function isPalindromicPair(a1?: string | null, a2?: string | null): boolean {
  if (!a1 || !a2) return false;
  const u1 = a1.toUpperCase().trim();
  const u2 = a2.toUpperCase().trim();
  return (
    (u1 === 'A' && u2 === 'T') ||
    (u1 === 'T' && u2 === 'A') ||
    (u1 === 'C' && u2 === 'G') ||
    (u1 === 'G' && u2 === 'C')
  );
}

/**
 * Parses user genotype call into an array of uppercase nucleotide bases.
 * Handles formats: "AA", "AG", "A/G", "A|G", "A", etc.
 * Filters out invalid/no-call symbols ('-', '0', '?', '.').
 */
export function parseUserGenotype(userCall: string | null | undefined): string[] {
  if (!userCall) return [];
  const trimmed = userCall.trim().toUpperCase();
  if (trimmed === '--' || trimmed === '00' || trimmed === '??' || trimmed === 'NN') {
    return [];
  }

  if (trimmed.includes('/') || trimmed.includes('|')) {
    return trimmed
      .split(/[/|]/)
      .map(b => b.trim())
      .filter(b => /^[ACGT]$/.test(b));
  }

  // Single or multi-character string
  const bases: string[] = [];
  for (let i = 0; i < trimmed.length; i++) {
    const c = trimmed[i];
    if (/^[ACGT]$/.test(c)) {
      bases.push(c);
    }
  }
  return bases;
}

/**
 * Unified allele matcher conforming to H-3 Stand Invariants.
 *
 * Contract for palindromic inference:
 * To infer palindromicity when `isPalindromic` is not explicitly provided, both alleles
 * of the locus must be known (either via both `refAllele` and `otherAllele`, or one allele
 * distinct from `targetAllele`). If only a single allele is known (e.g. `refAllele === targetAllele`
 * or only one allele provided without a distinct counterpart), palindromicity is treated as
 * unknown and the matcher fails closed (exact forward-strand matching only, no complement).
 *
 * @param userGenotype - Raw genotype call from user file (e.g. "AG", "A/G", "A")
 * @param targetAllele - The AIM reference/alternative allele to count dosage for (e.g. "A")
 * @param options - Additional marker context:
 *   - refAllele: reference allele for the locus
 *   - otherAllele: second allele of the locus (used to detect palindromic if not pre-flagged)
 *   - isPalindromic: explicit boolean override (e.g. from AIM record)
 */
export function matchGenotypeAlleles(
  userGenotype: string | null | undefined,
  targetAllele: string,
  options?: {
    refAllele?: string | null;
    otherAllele?: string | null;
    isPalindromic?: boolean | null;
  }
): StrandMatchResult {
  const target = (targetAllele || '').toUpperCase().trim();
  const userBases = parseUserGenotype(userGenotype);

  // Determine if locus is palindromic and if locus is verified non-palindromic.
  // Palindromic inference requires BOTH distinct alleles of the locus to be known.
  // If only a single allele is known (e.g. refAllele === target or neither provided),
  // locus palindromicity is unknown -> fail closed to exact forward-strand matching (no complement).
  const ref = options?.refAllele ? options.refAllele.toUpperCase().trim() : null;
  const other = options?.otherAllele ? options.otherAllele.toUpperCase().trim() : null;

  let a1: string | null = null;
  let a2: string | null = null;
  if (ref && other && ref !== other) {
    a1 = ref;
    a2 = other;
  } else if (ref && target && ref !== target) {
    a1 = ref;
    a2 = target;
  } else if (other && target && other !== target) {
    a1 = other;
    a2 = target;
  }

  const hasKnownPair = Boolean(a1 && a2);
  let palindromic = Boolean(options?.isPalindromic);
  if (!palindromic && hasKnownPair) {
    palindromic = isPalindromicPair(a1!, a2!);
  }
  const isKnownNonPalindromic = options?.isPalindromic === false || (hasKnownPair && !palindromic);

  if (!target || userBases.length === 0) {
    return {
      dosage: 0,
      isComplement: false,
      isPalindromic: palindromic,
      allelesMatched: [],
    };
  }

  let dosage = 0;
  let complementUsed = false;
  const matched: string[] = [];

  for (const base of userBases) {
    // 1. Exact forward match counts first (case-insensitive)
    if (base === target) {
      dosage += 1;
      matched.push(base);
    }
    // 2. Complement tried only on non-match AND NEVER on palindromic SNPs.
    // If marker alleles are unknown, fail closed on potentially palindromic genotypes (exact-only).
    // Complement only on verified/known non-palindromic markers.
    else if (isKnownNonPalindromic && complementBase(base) === target) {
      dosage += 1;
      complementUsed = true;
      matched.push(`comp(${base})`);
    }
  }

  return {
    dosage,
    isComplement: complementUsed,
    isPalindromic: palindromic,
    allelesMatched: matched,
  };
}
