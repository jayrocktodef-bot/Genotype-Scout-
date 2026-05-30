import { loadMasterAims } from './data/index';
import { AnchorAim } from './types/genotype';

// Initialize on first use or cache
let masterAimsCache: any = null;
const getMasterAims = () => {
  if (!masterAimsCache) masterAimsCache = loadMasterAims();
  return masterAimsCache;
};

export type { AnchorAim };

export const ANCHOR_AIMS: AnchorAim[] = Object.values(getMasterAims()) as AnchorAim[];

let globalAnchors: Record<string, AnchorAim> | null = null;

export const loadGlobalAnchors = async (): Promise<Record<string, AnchorAim>> => {
  if (globalAnchors) return globalAnchors;
  
  try {
    const response = await fetch('/data/1kgp_global_anchors.json');
    if (!response.ok) throw new Error('Failed to load global anchors');
    globalAnchors = await response.json();
    return globalAnchors!;
  } catch (error) {
    console.error('Error loading global anchors:', error);
    return {};
  }
};
