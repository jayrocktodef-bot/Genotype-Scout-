const SALT = "genotype-scout-salt";

export const saveResults = (results: any[]) => {
  const data = JSON.stringify(results);
  const encrypted = btoa(unescape(encodeURIComponent(data + SALT)));
  sessionStorage.setItem("genotype_results", encrypted);
};

export const loadResults = () => {
  const encrypted = sessionStorage.getItem("genotype_results");
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
  sessionStorage.removeItem("genotype_results");
};
