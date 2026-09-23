
import { calculateCYP2D6Status, MetabolizerStatus } from '../../utils/pgxAdvanced';

export interface MedicationReport {
  drug: string;
  category: string;
  status: 'Normal' | 'Caution' | 'Action Required';
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
      status: 'Action Required',
      severity: 'High',
      gene: 'CYP2D6',
      insight: 'Poor metabolizer status detected. These medications may be ineffective or lead to toxicity due to inability to process the prodrug into its active form.'
    });
  } else if (cyp2d6.status === MetabolizerStatus.ULTRARAPID) {
    reports.push({
      drug: 'Codeine',
      category: 'Pain Management',
      status: 'Action Required',
      severity: 'High',
      gene: 'CYP2D6',
      insight: 'Ultrarapid metabolizer status detected. Dangerous risk of morphine toxicity even at standard doses. Avoid use.'
    });
  }

  // Example: Warfarin (Coumadin) Sensitivity
  const vkorc1 = getSnp(userSnps, 'rs9923231');
  if (vkorc1 === 'AA' || vkorc1 === 'TT') { 
    reports.push({
      drug: 'Warfarin',
      category: 'Blood Thinner',
      status: 'Action Required',
      severity: 'High',
      gene: 'VKORC1',
      insight: 'High sensitivity detected. Lower initial doses may be required to prevent bleeding risk.'
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
        status: 'Action Required',
        severity: 'High',
        gene: 'SLCO1B1',
        insight: 'Markedly increased risk of statin-induced myopathy (muscle pain/rhabdomyolysis) due to poor SLCO1B1 transporter function. Consider alternative statin (e.g. pravastatin, rosuvastatin) or reduced starting dose.'
      });
    } else if (isHetRisk) {
      reports.push({
        drug: 'Simvastatin',
        category: 'Cholesterol',
        status: 'Caution',
        severity: 'Moderate',
        gene: 'SLCO1B1',
        insight: 'Increased risk of statin-induced myopathy (muscle pain) due to intermediate SLCO1B1 transporter function. Consider lower starting dose.'
      });
    }
  }

  return reports;
}
