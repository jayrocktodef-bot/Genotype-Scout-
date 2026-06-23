
export function applyConfidenceIntervals(percentage: number, markerCount: number) {
  // Simple Standard Error (SE) approximation for population proportions
  // SE = sqrt( p * (1 - p) / n )
  if (markerCount === 0) return { low: "0.0", high: "0.0", isSignificant: false };
  
  const p = percentage / 100;
  const standardError = Math.sqrt((p * (1 - p)) / markerCount);
  
  // 95% Confidence Interval (1.96 * SE)
  const marginOfError = 1.96 * standardError * 100;

  return {
    low: Math.max(0, percentage - marginOfError).toFixed(1),
    high: Math.min(100, percentage + marginOfError).toFixed(1),
    marginOfError: marginOfError.toFixed(2),
    isSignificant: markerCount > 50 && marginOfError < (percentage / 2)
  };
}
