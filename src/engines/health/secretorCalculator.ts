export function calculateSecretorStatus(userSnps: Record<string, string> | undefined) {
  if (!userSnps) {
    return {
      status: "Unknown",
      traits: []
    };
  }
  // Helper to safely get and normalize genotype string
  const getSnp = (rsid: string) => {
    const val = userSnps[rsid] || userSnps[rsid.toLowerCase()] || userSnps[rsid.toUpperCase()];
    if (!val || val === '--' || val === '00' || val === 'NN' || val === '??') return null;
    return val.trim().toUpperCase().replace(/[\s\/_]/g, '');
  };

  const f1 = getSnp('rs601338'); // The primary European/African marker
  const f2 = getSnp('rs1047781'); // The primary East Asian marker

  let status = "Unknown";
  let traits: string[] = [];

  // Logic for rs601338 (Ref G = Secretor, Alt A = Non-Secretor; Minus strand C/T)
  if (f1) {
    if (f1 === 'AA' || f1 === 'TT') {
      status = "Non-Secretor";
    } else if (['GG', 'GA', 'AG', 'CC', 'CT', 'TC'].includes(f1)) {
      status = "Secretor";
    }
  } 
  // Fallback/Secondary check for East Asian lineages (rs1047781: Ref C = Secretor, Alt T = Non-Secretor; Minus strand G/A)
  if (status === "Unknown" && f2) {
    if (f2 === 'TT' || f2 === 'AA') {
      status = "Non-Secretor";
    } else if (['CC', 'CT', 'TC', 'GG', 'GA', 'AG'].includes(f2)) {
      status = "Secretor";
    }
  }

  // Actionable Insights for the "Pro" report
  if (status === "Non-Secretor") {
    traits = [
      "🛡️ Strong resistance to Norovirus (stomach flu).",
      "📈 Potentially higher Vitamin B12 levels in blood tests.",
      "⚠️ Slightly higher risk for certain gut issues (e.g., Crohn's or T1D)."
    ];
  } else if (status === "Secretor") {
    traits = [
      "🦠 Higher susceptibility to Norovirus and Rotavirus.",
      "🥗 Generally more diverse gut microbiome (Bifidobacteria).",
      "📉 May show lower B12 levels compared to non-secretors."
    ];
  }

  return { status, traits };
}
