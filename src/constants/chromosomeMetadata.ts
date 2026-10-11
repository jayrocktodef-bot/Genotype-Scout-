/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Human reference genome GRCh38 chromosome lengths in base pairs.
 */
export const CHROMOSOME_LENGTHS: Record<string, number> = {
  "1": 248956422, "2": 242193529, "3": 198295559, "4": 190214555, "5": 181538259, "6": 170805979, 
  "7": 159345973, "8": 145138636, "9": 138394717, "10": 133797422, "11": 135086622, "12": 133851895, 
  "13": 115169878, "14": 107349540, "15": 102520552, "16": 90354753, "17": 83257441, "18": 80373285, 
  "19": 59128983, "20": 63025520, "21": 48129895, "22": 51304566, "X": 156040895, "Y": 57227415
};

/**
 * Human reference genome GRCh38 approximate centromere positions in megabases (Mbp).
 * Used for cytoband primary constriction pinch visualization and spatial partitioning.
 */
export const CENTROMERE_POSITIONS_MB: Record<string, number> = {
  "1": 125, "2": 93, "3": 91, "4": 50, "5": 48, "6": 60, "7": 59,
  "8": 45, "9": 49, "10": 40, "11": 53, "12": 35, "13": 17, "14": 17,
  "15": 19, "16": 36, "17": 25, "18": 17, "19": 26, "20": 28,
  "21": 13, "22": 15, "X": 60, "Y": 13
};

/**
 * Standard chromosome ordering array: 1-22, X, Y.
 */
export const CHROMOSOME_ORDER = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
  "21", "22", "X", "Y"
];
