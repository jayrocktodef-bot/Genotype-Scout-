
import { calculateCYP2D6Status, MetabolizerStatus } from '../../utils/pgxAdvanced';

export interface MedicationReport {
  drug: string;
  category: string;
  status: 'Typical' | 'Review with clinician' | 'Discuss with clinician';
  insight: string;
  gene?: string;
  severity?: 'High' | 'Moderate' | 'Low';
}

function getSnp(userSnps: Record<string, string> | undefined, rsid: string): string | null {
  if (!userSnps) return null;
  const val = userSnps[rsid] || userSnps[rsid.toLowerCase()] || userSnps[rsid.toUpperCase()];
  if (!val || val === '--' || val === '00' || val === 'NN' || val === '??') return null;
  return val.trim().toUpperCase().replace(/[\s\/_]/g, '');
}

export function calculateMedicationSafety(userSnps: Record<string, string>): MedicationReport[] {
  const reports: MedicationReport[] = [];

  // CYP2D6 Analysis
  const cyp2d6 = calculateCYP2D6Status(userSnps);
  if (cyp2d6.status === MetabolizerStatus.POOR) {
    reports.push({
      drug: 'Codeine / Tramadol',
      category: 'Pain Management',
      status: 'Discuss with clinician',
      severity: 'High',
      gene: 'CYP2D6',
      insight: 'CYP2D6 poor metabolizer phenotype predicted from your raw file. Codeine and tramadol are prodrugs that need CYP2D6 to become active, so pain relief may be reduced. Consumer microarray calls can be wrong, especially for rare variants. Share this result with your doctor or pharmacist before any medication change.'
    });
  } else if (cyp2d6.status === MetabolizerStatus.ULTRARAPID) {
    reports.push({
      drug: 'Codeine',
      category: 'Pain Management',
      status: 'Discuss with clinician',
      severity: 'High',
      gene: 'CYP2D6',
      insight: 'CYP2D6 ultrarapid metabolizer phenotype predicted from your raw file. Codeine can convert to morphine faster than usual. Do not change or stop any medication on the basis of this app. Talk to your doctor or pharmacist, who can confirm with clinical testing.'
    });
  }

  // Example: Warfarin (Coumadin) Sensitivity
  const vkorc1 = getSnp(userSnps, 'rs9923231');
  if (vkorc1 === 'AA' || vkorc1 === 'TT') { 
    reports.push({
      drug: 'Warfarin',
      category: 'Blood Thinner',
      status: 'Discuss with clinician',
      severity: 'High',
      gene: 'VKORC1',
      insight: 'A VKORC1 variant associated with higher warfarin sensitivity was found in your raw file. Warfarin dosing is managed by clinicians using INR blood tests. Do not adjust any dose based on this app. Bring this result to your prescriber.'
    });
  }

  // Example: Statins (Muscle Pain Risk) - SLCO1B1*5 c.526T>C (rs4149056)
  const slco1b1 = getSnp(userSnps, 'rs4149056');
  if (slco1b1) {
    const isHomRisk = slco1b1 === 'CC' || slco1b1 === 'GG';
    const isHetRisk = ['CT', 'TC', 'GA', 'AG'].includes(slco1b1);
    if (isHomRisk) {
      reports.push({
        drug: 'Simvastatin',
        category: 'Cholesterol',
        status: 'Discuss with clinician',
        severity: 'High',
        gene: 'SLCO1B1',
        insight: 'An SLCO1B1 reduced-function genotype was found in your raw file, associated in research with higher rates of statin-related muscle symptoms. Do not change or stop your statin based on this app. Discuss with your prescriber.'
      });
    } else if (isHetRisk) {
      reports.push({
        drug: 'Simvastatin',
        category: 'Cholesterol',
        status: 'Review with clinician',
        severity: 'Moderate',
        gene: 'SLCO1B1',
        insight: 'An SLCO1B1 intermediate-function genotype was found in your raw file, associated in research with a modest increase in statin-related muscle symptoms. Do not change dosing based on this app. Discuss with your prescriber.'
      });
    }
  }

  return reports;
}
