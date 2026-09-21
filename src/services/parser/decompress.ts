import { gunzipSync, unzipSync } from 'fflate';
import { GenomicsError, GenomicsErrorCode } from '../errorCaller';
import { checkUnsupportedArchive } from './byteStream';

const MAX_DECOMPRESSED_BYTES = 2500 * 1024 * 1024; // 2.5 GB ceiling
const MAX_DECOMPRESSION_DEPTH = 3;

function decompressGzipBuffer(buf: Uint8Array): Uint8Array {
  // Check if BGZF (Block GZIP Format, used by all standard .vcf.gz)
  const isBgzf = buf.length >= 18 && (buf[3] & 4) !== 0 && buf[12] === 0x42 && buf[13] === 0x43;
  if (isBgzf) {
    let offset = 0;
    const chunks: Uint8Array[] = [];
    let totalSize = 0;
    while (offset < buf.length) {
      if (buf[offset] !== 0x1f || buf[offset + 1] !== 0x8b) break;
      const bsize = (buf[offset + 16] | (buf[offset + 17] << 8)) + 1;
      if (bsize <= 0 || offset + bsize > buf.length) break;
      const block = buf.subarray(offset, offset + bsize);
      const decomp = gunzipSync(block);
      if (decomp.length > 0) {
        chunks.push(decomp);
        totalSize += decomp.length;
        if (totalSize > MAX_DECOMPRESSED_BYTES) {
          throw new GenomicsError(`Decompressed BGZF dataset exceeds safety threshold (2.5 GB).`, {
            errorCode: GenomicsErrorCode.ERR_PARSE_DECOMPRESSION_THRESHOLD,
            subsystem: 'ZIP_DECOMPRESSION',
            suggestedSolution:
              'Your uncompressed dataset is larger than 2.5 GB. Please upload an uncompressed .vcf or streaming .vcf.gz dataset directly.'
          });
        }
      }
      offset += bsize;
    }
    const merged = new Uint8Array(totalSize);
    let cur = 0;
    for (const c of chunks) {
      merged.set(c, cur);
      cur += c.length;
    }
    return merged;
  } else {
    try {
      const result = gunzipSync(buf);
      if (result.byteLength > MAX_DECOMPRESSED_BYTES) {
        throw new GenomicsError(`Decompressed file exceeds safety threshold (2.5 GB).`, {
          errorCode: GenomicsErrorCode.ERR_PARSE_DECOMPRESSION_THRESHOLD,
          subsystem: 'ZIP_DECOMPRESSION',
          suggestedSolution:
            'Your uncompressed dataset is larger than 2.5 GB. Please upload an uncompressed .vcf or streaming .vcf.gz dataset directly.'
        });
      }
      return result;
    } catch (err) {
      if (err instanceof GenomicsError) throw err;
      let offset = 0;
      const chunks: Uint8Array[] = [];
      let totalSize = 0;
      while (offset < buf.length) {
        if (buf[offset] !== 0x1f || buf[offset + 1] !== 0x8b) break;
        let nextHeader = -1;
        for (let i = offset + 2; i < buf.length - 1; i++) {
          if (buf[i] === 0x1f && buf[i + 1] === 0x8b) {
            nextHeader = i;
            break;
          }
        }
        const slice = nextHeader !== -1 ? buf.subarray(offset, nextHeader) : buf.subarray(offset);
        try {
          const decomp = gunzipSync(slice);
          if (decomp.length > 0) {
            chunks.push(decomp);
            totalSize += decomp.length;
          }
        } catch {
          // ignore invalid chunk
        }
        if (nextHeader === -1) break;
        offset = nextHeader;
      }
      if (chunks.length > 0) {
        const merged = new Uint8Array(totalSize);
        let cur = 0;
        for (const c of chunks) {
          merged.set(c, cur);
          cur += c.length;
        }
        return merged;
      }
      throw err;
    }
  }
}

function extractBestFileFromZip(buf: Uint8Array): Uint8Array {
  const unzipped = unzipSync(buf, {
    filter(file) {
      const lower = file.name.toLowerCase();
      const baseName = lower.split('/').pop() || '';
      return (
        !lower.startsWith('__macosx/') &&
        !baseName.startsWith('._') &&
        !lower.includes('.ds_store') &&
        !lower.includes('..') &&
        !lower.endsWith('/') &&
        !lower.endsWith('.pdf') &&
        !lower.endsWith('.html') &&
        !lower.endsWith('.png') &&
        !lower.endsWith('.jpg') &&
        !lower.endsWith('.jpeg') &&
        !lower.endsWith('.gif') &&
        !lower.endsWith('.xml') &&
        !lower.endsWith('.json') &&
        !lower.endsWith('.md')
      );
    }
  });
  let totalExtractedSize = 0;
  for (const k of Object.keys(unzipped)) {
    totalExtractedSize += unzipped[k]?.byteLength || 0;
  }
  if (totalExtractedSize > MAX_DECOMPRESSED_BYTES) {
    throw new GenomicsError(`ZIP archive extracted payload exceeds safety threshold (500 MB).`, {
      errorCode: GenomicsErrorCode.ERR_PARSE_DECOMPRESSION_THRESHOLD,
      subsystem: 'ZIP_DECOMPRESSION',
      suggestedSolution:
        'Your ZIP bundle extracted payload exceeds 500MB. Extract the ZIP on your device and upload only the primary raw text file.'
    });
  }

  const fileKeys = Object.keys(unzipped).filter(k => {
    const lower = k.toLowerCase();
    const baseName = lower.split('/').pop() || '';
    return (
      !lower.startsWith('__macosx/') &&
      !baseName.startsWith('._') &&
      !lower.includes('.ds_store') &&
      !lower.includes('..') &&
      !lower.endsWith('/') &&
      !lower.endsWith('.pdf') &&
      !lower.endsWith('.html') &&
      !lower.endsWith('.png') &&
      !lower.endsWith('.jpg') &&
      !lower.endsWith('.jpeg') &&
      !lower.endsWith('.gif') &&
      !lower.endsWith('.xml') &&
      !lower.endsWith('.json') &&
      !lower.endsWith('.md')
    );
  });

  if (fileKeys.length === 0) {
    return buf;
  }

  fileKeys.sort((a, b) => {
    const score = (key: string) => {
      const l = key.toLowerCase();
      let s = 0;
      if (
        l.includes('readme') ||
        l.includes('disclaimer') ||
        l.includes('license') ||
        l.includes('notice') ||
        l.includes('terms') ||
        l.includes('release_notes')
      ) {
        s -= 500;
      }
      if (l.endsWith('.vcf') || l.endsWith('.vcf.gz') || l.endsWith('.vcf.zip')) s += 100;
      if (l.endsWith('.txt') || l.endsWith('.txt.gz') || l.endsWith('.txt.zip')) s += 90;
      if (l.endsWith('.csv') || l.endsWith('.csv.gz') || l.endsWith('.csv.zip')) s += 80;
      if (l.endsWith('.tsv') || l.endsWith('.tsv.gz') || l.endsWith('.tsv.zip')) s += 70;
      if (l.endsWith('.dat')) s += 60;
      if (l.endsWith('.gz') || l.endsWith('.zip')) s += 40;
      if (
        l.includes('genome') ||
        l.includes('dna') ||
        l.includes('ancestry') ||
        l.includes('23andme') ||
        l.includes('myheritage') ||
        l.includes('ftdna') ||
        l.includes('livingdna')
      ) {
        s += 30;
      }
      const sz = unzipped[key]?.byteLength || 0;
      if (sz > 100000) s += 50;
      if (sz > 1000000) s += 50;
      return s;
    };
    return score(b) - score(a);
  });

  return unzipped[fileKeys[0]];
}

export function decompressGenomicBuffer(buf: Uint8Array): Uint8Array {
  if (!buf || buf.length < 3) return buf;

  checkUnsupportedArchive(buf);

  let result = buf;
  let depth = 0;

  while (depth < MAX_DECOMPRESSION_DEPTH && result && result.length >= 4) {
    checkUnsupportedArchive(result);
    // 1. Check for GZIP magic bytes (\x1f\x8b)
    if (result[0] === 0x1f && result[1] === 0x8b) {
      try {
        const decompressed = decompressGzipBuffer(result);
        result = decompressed;
        depth++;
      } catch (e) {
        if (e instanceof GenomicsError) throw e;
        console.warn('fflate gunzipSync warning:', e);
        break;
      }
    }
    // 2. Check for ZIP magic bytes (PK\x03\x04, PK\x05\x06, PK\x07\x08)
    else if (
      result[0] === 0x50 &&
      result[1] === 0x4b &&
      (result[2] === 0x03 || result[2] === 0x05 || result[2] === 0x07)
    ) {
      try {
        const extracted = extractBestFileFromZip(result);
        if (extracted === result) break;
        result = extracted;
        depth++;
      } catch (e) {
        if (e instanceof GenomicsError) throw e;
        console.warn('fflate unzipSync warning:', e);
        break;
      }
    } else {
      break;
    }
  }

  checkUnsupportedArchive(result);

  // Strip UTF-8 BOM (\xef\xbb\xbf)
  if (result.length >= 3 && result[0] === 0xef && result[1] === 0xbb && result[2] === 0xbf) {
    result = result.subarray(3);
  }

  return result;
}
