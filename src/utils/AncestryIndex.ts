
export interface Marker {
  rsid: string;
  region: string;
  alleles: string[];
  weight: number;
  frequencies: Record<string, number>;
  description?: string;
  gene?: string;
  trait?: string;
  category?: string;
}

export class AncestryIndex {
  private index: Map<string, Marker>;

  constructor(markers: Record<string, Marker>) {
    this.index = new Map(Object.entries(markers).map(([rsid, marker]) => [rsid.toLowerCase(), marker]));
  }

  getMarker(rsid: string): Marker | undefined {
    return this.index.get(rsid.toLowerCase());
  }

  getAllMarkers(): Marker[] {
    return Array.from(this.index.values());
  }

  getSize(): number {
    return this.index.size;
  }
}
