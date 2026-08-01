/**
 * Helper to fetch local JSON assets in both browser and test environments.
 * In a browser, it uses native fetch. In Node.js/Vitest, it reads directly from the public/ directory.
 */
export async function fetchJsonAsset(relativeUrl: string): Promise<any> {
  const cleanUrl = relativeUrl.startsWith('/') ? relativeUrl.slice(1) : relativeUrl;

  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', cleanUrl);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (err) {
      console.error(`Failed to read asset from filesystem in test: ${cleanUrl}`, err);
      throw err;
    }
  }

  const pathsToTry = [
    relativeUrl,
    './' + cleanUrl,
    (typeof location !== 'undefined' && location.origin ? location.origin : '') + '/' + cleanUrl
  ];

  let lastErr: any = null;
  for (const p of pathsToTry) {
    try {
      const response = await fetch(p);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      lastErr = err;
    }
  }

  throw new Error(`Failed to fetch JSON asset: ${relativeUrl} (${lastErr ? String(lastErr) : '404/Network Error'})`);
}
