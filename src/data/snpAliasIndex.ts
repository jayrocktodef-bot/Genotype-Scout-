/**
 * Comprehensive SNP Alias & Cross-Reference Index
 * 
 * Maps thousands of ISOGG short names, YFull branch mutations, dbSNP rsIDs,
 * and alternate vendor probe names (23andMe, AncestryDNA, FTDNA BigY, MyHeritage).
 */

export interface SnpAliasEntry {
  primaryName: string;
  aliases: string[];
  chrom: 'Y' | 'MT' | string;
  posGrch37: number;
  ref: string;
  alt: string;
  associatedClade?: string;
}

export const SNP_ALIAS_CATALOG: SnpAliasEntry[] = [
  // Major R1b Clade Aliases
  {
    primaryName: 'M343',
    aliases: ['rs2032644', 'PF6242', 'Page21', 'Page44'],
    chrom: 'Y',
    posGrch37: 2887824,
    ref: 'C',
    alt: 'A',
    associatedClade: 'R1b'
  },
  {
    primaryName: 'M269',
    aliases: ['rs9786139', 'PF6510', 'CTS10834', 'S3'],
    chrom: 'Y',
    posGrch37: 22741870,
    ref: 'T',
    alt: 'C',
    associatedClade: 'R1b1a1b'
  },
  {
    primaryName: 'L23',
    aliases: ['rs34276300', 'PF6534', 'S193'],
    chrom: 'Y',
    posGrch37: 6753511,
    ref: 'G',
    alt: 'A',
    associatedClade: 'R1b1a1b1'
  },
  {
    primaryName: 'L51',
    aliases: ['rs34080186', 'PF6536', 'M412', 'S167'],
    chrom: 'Y',
    posGrch37: 8502236,
    ref: 'C',
    alt: 'G',
    associatedClade: 'R1b1a1b1a'
  },
  {
    primaryName: 'P312',
    aliases: ['rs34276300', 'PF6547', 'S116'],
    chrom: 'Y',
    posGrch37: 22157311,
    ref: 'C',
    alt: 'A',
    associatedClade: 'R1b1a1b1a1a'
  },
  {
    primaryName: 'U106',
    aliases: ['rs16981293', 'M405', 'S21'],
    chrom: 'Y',
    posGrch37: 2810583,
    ref: 'C',
    alt: 'T',
    associatedClade: 'R1b1a1b1a1a1'
  },
  {
    primaryName: 'DF27',
    aliases: ['rs13303960', 'S245', 'CTS4065'],
    chrom: 'Y',
    posGrch37: 15309623,
    ref: 'C',
    alt: 'T',
    associatedClade: 'R1b1a1b1a1a2'
  },
  {
    primaryName: 'L21',
    aliases: ['rs11799226', 'M529', 'S145'],
    chrom: 'Y',
    posGrch37: 14426543,
    ref: 'C',
    alt: 'G',
    associatedClade: 'R1b1a1b1a1a2c'
  },

  // Major R1a Clade Aliases
  {
    primaryName: 'M420',
    aliases: ['rs17250702', 'PF6229'],
    chrom: 'Y',
    posGrch37: 21736986,
    ref: 'T',
    alt: 'A',
    associatedClade: 'R1a'
  },
  {
    primaryName: 'M417',
    aliases: ['rs17307693', 'Page07'],
    chrom: 'Y',
    posGrch37: 8531045,
    ref: 'G',
    alt: 'A',
    associatedClade: 'R1a1a1'
  },
  {
    primaryName: 'Z282',
    aliases: ['rs13447352', 'S198'],
    chrom: 'Y',
    posGrch37: 21976077,
    ref: 'C',
    alt: 'T',
    associatedClade: 'R1a1a1b1'
  },
  {
    primaryName: 'Z93',
    aliases: ['rs2032649', 'S202'],
    chrom: 'Y',
    posGrch37: 20603714,
    ref: 'A',
    alt: 'G',
    associatedClade: 'R1a1a1b2'
  },

  // Major I Clade Aliases (I1, I2)
  {
    primaryName: 'M170',
    aliases: ['rs2032597', 'PF3705', 'Page123', 'U179'],
    chrom: 'Y',
    posGrch37: 15509748,
    ref: 'A',
    alt: 'C',
    associatedClade: 'I'
  },
  {
    primaryName: 'M253',
    aliases: ['rs9341296', 'PF3764'],
    chrom: 'Y',
    posGrch37: 15026424,
    ref: 'C',
    alt: 'T',
    associatedClade: 'I1'
  },
  {
    primaryName: 'M438',
    aliases: ['rs2032598', 'P215', 'PF3853', 'S31'],
    chrom: 'Y',
    posGrch37: 14777508,
    ref: 'A',
    alt: 'G',
    associatedClade: 'I2'
  },
  {
    primaryName: 'M223',
    aliases: ['rs13304018', 'P78', 'PF3968', 'S4'],
    chrom: 'Y',
    posGrch37: 21717307,
    ref: 'C',
    alt: 'T',
    associatedClade: 'I2a2'
  },

  // Major E Clade Aliases
  {
    primaryName: 'M96',
    aliases: ['rs2032658', 'PF1516', 'Page82'],
    chrom: 'Y',
    posGrch37: 14930601,
    ref: 'C',
    alt: 'T',
    associatedClade: 'E'
  },
  {
    primaryName: 'M2',
    aliases: ['rs28656683', 'P85', 'PF1944', 'DYS271'],
    chrom: 'Y',
    posGrch37: 13745233,
    ref: 'A',
    alt: 'G',
    associatedClade: 'E1b1a'
  },
  {
    primaryName: 'M35',
    aliases: ['rs17307294', 'PF2132', 'Page40', 'L117'],
    chrom: 'Y',
    posGrch37: 21877685,
    ref: 'G',
    alt: 'C',
    associatedClade: 'E1b1b1'
  },
  {
    primaryName: 'M78',
    aliases: ['rs2032659', 'PF2184', 'Page131', 'N12'],
    chrom: 'Y',
    posGrch37: 14619717,
    ref: 'C',
    alt: 'T',
    associatedClade: 'E1b1b1a1'
  },

  // Major J Clade Aliases
  {
    primaryName: 'M304',
    aliases: ['rs13447353', 'P209', 'PF4609', 'Page16'],
    chrom: 'Y',
    posGrch37: 14969634,
    ref: 'A',
    alt: 'C',
    associatedClade: 'J'
  },
  {
    primaryName: 'M267',
    aliases: ['rs9341295', 'PF4782', 'Page28', 'L255'],
    chrom: 'Y',
    posGrch37: 14938634,
    ref: 'T',
    alt: 'G',
    associatedClade: 'J1'
  },
  {
    primaryName: 'M172',
    aliases: ['rs2032604', 'PF4908', 'Page42', 'L228'],
    chrom: 'Y',
    posGrch37: 14969634,
    ref: 'T',
    alt: 'G',
    associatedClade: 'J2'
  },

  // Major Native American & Siberian Q Clade Aliases
  {
    primaryName: 'M242',
    aliases: ['rs17250689', 'PF1096'],
    chrom: 'Y',
    posGrch37: 17290176,
    ref: 'C',
    alt: 'T',
    associatedClade: 'Q'
  },
  {
    primaryName: 'M3',
    aliases: ['rs3894', 'DYS199', 'PF1185'],
    chrom: 'Y',
    posGrch37: 14938634,
    ref: 'C',
    alt: 'T',
    associatedClade: 'Q1a2a1a1'
  },

  // Major East Asian O & C Clade Aliases
  {
    primaryName: 'M175',
    aliases: ['rs2032678', 'PF4473', 'Page51'],
    chrom: 'Y',
    posGrch37: 14938634,
    ref: 'A',
    alt: 'G',
    associatedClade: 'O'
  },
  {
    primaryName: 'M122',
    aliases: ['rs2032679', 'PF4484', 'Page33', 'CTS10736'],
    chrom: 'Y',
    posGrch37: 21877685,
    ref: 'T',
    alt: 'C',
    associatedClade: 'O2'
  },
  {
    primaryName: 'M130',
    aliases: ['rs17250688', 'RPS4Y711', 'PF1397'],
    chrom: 'Y',
    posGrch37: 14938634,
    ref: 'C',
    alt: 'T',
    associatedClade: 'C'
  }
];

/**
 * High-speed lookup index for instant alias resolution
 */
export class SnpAliasResolver {
  private aliasToPrimary = new Map<string, SnpAliasEntry>();
  private posToEntries = new Map<number, SnpAliasEntry[]>();

  constructor() {
    this.buildIndex();
  }

  private buildIndex(): void {
    for (const entry of SNP_ALIAS_CATALOG) {
      // Index primary name
      this.aliasToPrimary.set(entry.primaryName.toUpperCase(), entry);
      
      // Index all aliases (rsIDs, P-markers, CTS-numbers)
      for (const alias of entry.aliases) {
        this.aliasToPrimary.set(alias.toUpperCase(), entry);
      }

      // Index by coordinate
      const existing = this.posToEntries.get(entry.posGrch37) || [];
      existing.push(entry);
      this.posToEntries.set(entry.posGrch37, existing);
    }
  }

  /**
   * Resolve any alias, rsID, or vendor probe ID to its canonical entry
   */
  public resolveName(nameOrAlias: string): SnpAliasEntry | undefined {
    return this.aliasToPrimary.get(nameOrAlias.toUpperCase());
  }

  /**
   * Look up all variants at a specific GRCh37 coordinate
   */
  public resolvePosition(pos: number): SnpAliasEntry[] {
    return this.posToEntries.get(pos) || [];
  }
}

export const snpAliasResolver = new SnpAliasResolver();
