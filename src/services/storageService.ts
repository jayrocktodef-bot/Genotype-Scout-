const SALT = "genotype-scout-salt";

export const saveResults = (results: any[]) => {
  const data = JSON.stringify(results);
  const encrypted = btoa(unescape(encodeURIComponent(data + SALT)));
  localStorage.setItem("genotype_results", encrypted);
};

export const loadResults = () => {
  const encrypted = localStorage.getItem("genotype_results");
  if (!encrypted) return null;
  try {
    const decrypted = decodeURIComponent(escape(atob(encrypted))).replace(SALT, "");
    return JSON.parse(decrypted);
  } catch (e) {
    console.error("Failed to load results", e);
    return null;
  }
};

export const clearResults = () => {
  localStorage.removeItem("genotype_results");
};
