export function calculateSecretorStatus(userSnps: Record<string, string> | undefined) {
  if (!userSnps) {
    return {
      status: "Unknown",
      traits: []
    };
  }
  const fut2 = userSnps['rs601338']; // The primary European/African marker
  const fut2_asian = userSnps['rs1047781']; // The primary East Asian marker

  let status = "Unknown";
  let traits = [];

  // Logic for rs601338
  if (fut2 === 'AA') {
    status = "Non-Secretor";
  } else if (fut2 === 'GG' || fut2 === 'GA' || fut2 === 'AG') {
    status = "Secretor";
  } 
  // Fallback/Secondary check for East Asian lineages
  else if (fut2_asian === 'TT') {
    status = "Non-Secretor";
  } else if (fut2_asian === 'AA' || fut2_asian === 'AT' || fut2_asian === 'TA') {
    status = "Secretor";
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
