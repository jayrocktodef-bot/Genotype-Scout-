import { GenomicsError, GenomicsErrorCode } from '../errorCaller';

export const LF = 0x0a;
export const CR = 0x0d;
export const HASH = 0x23;
export const SLASH = 0x2f;
export const TAB = 0x09;
export const COMMA = 0x2c;
export const SEMICOLON = 0x3b;
export const SPACE = 0x20;
export const QUOTE = 0x22;

export const DECODER = new TextDecoder('utf-8');

/**
 * Checks for unsupported archive formats (.7z, .rar, .bz2, .xz, .tar) via magic bytes
 * and throws an actionable GenomicsError with ERR_ARCHIVE_UNSUPPORTED.
 */
export function checkUnsupportedArchive(buf: Uint8Array): void {
  if (!buf || buf.length < 3) return;

  // 7-Zip: 37 7A BC AF 27 1C
  if (
    buf.length >= 6 &&
    buf[0] === 0x37 &&
    buf[1] === 0x7a &&
    buf[2] === 0xbc &&
    buf[3] === 0xaf &&
    buf[4] === 0x27 &&
    buf[5] === 0x1c
  ) {
    throw new GenomicsError(
      'Unsupported 7-Zip (.7z) archive format. Please decompress the file on your device and upload the uncompressed .txt, .csv, or .vcf file.',
      {
        errorCode: GenomicsErrorCode.ERR_ARCHIVE_UNSUPPORTED,
        subsystem: 'ZIP_DECOMPRESSION',
        suggestedSolution:
          'Decompress the .7z archive using 7-Zip or an archive utility on your computer, then upload the extracted DNA data file directly.'
      }
    );
  }

  // RAR: 52 61 72 21 (Rar!)
  if (buf.length >= 4 && buf[0] === 0x52 && buf[1] === 0x61 && buf[2] === 0x72 && buf[3] === 0x21) {
    throw new GenomicsError(
      'Unsupported RAR (.rar) archive format. Please decompress the file on your device and upload the uncompressed .txt, .csv, or .vcf file.',
      {
        errorCode: GenomicsErrorCode.ERR_ARCHIVE_UNSUPPORTED,
        subsystem: 'ZIP_DECOMPRESSION',
        suggestedSolution:
          'Decompress the .rar archive using WinRAR, Unrar, or 7-Zip, then upload the extracted DNA data file directly.'
      }
    );
  }

  // Bzip2: 42 5A 68 (BZh)
  if (buf.length >= 3 && buf[0] === 0x42 && buf[1] === 0x5a && buf[2] === 0x68) {
    throw new GenomicsError(
      'Unsupported Bzip2 (.bz2) archive format. Please decompress the file on your device and upload the uncompressed .txt, .csv, or .vcf file.',
      {
        errorCode: GenomicsErrorCode.ERR_ARCHIVE_UNSUPPORTED,
        subsystem: 'ZIP_DECOMPRESSION',
        suggestedSolution:
          'Decompress the .bz2 archive using bunzip2 or an archive utility, then upload the extracted file.'
      }
    );
  }

  // XZ: FD 37 7A 58 5A 00 (\xFD7zXZ\x00)
  if (
    buf.length >= 6 &&
    buf[0] === 0xfd &&
    buf[1] === 0x37 &&
    buf[2] === 0x7a &&
    buf[3] === 0x58 &&
    buf[4] === 0x5a &&
    buf[5] === 0x00
  ) {
    throw new GenomicsError(
      'Unsupported XZ (.xz) archive format. Please decompress the file on your device and upload the uncompressed .txt, .csv, or .vcf file.',
      {
        errorCode: GenomicsErrorCode.ERR_ARCHIVE_UNSUPPORTED,
        subsystem: 'ZIP_DECOMPRESSION',
        suggestedSolution:
          'Decompress the .xz archive using unxz or an archive utility, then upload the extracted file.'
      }
    );
  }

  // TAR: 75 73 74 61 72 ("ustar" at offset 257)
  if (
    buf.length >= 262 &&
    buf[257] === 0x75 &&
    buf[258] === 0x73 &&
    buf[259] === 0x74 &&
    buf[260] === 0x61 &&
    buf[261] === 0x72
  ) {
    throw new GenomicsError(
      'Unsupported TAR (.tar) archive format. Please decompress the file on your device and upload the uncompressed .txt, .csv, or .vcf file.',
      {
        errorCode: GenomicsErrorCode.ERR_ARCHIVE_UNSUPPORTED,
        subsystem: 'ZIP_DECOMPRESSION',
        suggestedSolution:
          'Extract the .tar archive on your computer, then upload the extracted DNA data file directly.'
      }
    );
  }
}

/**
 * Decodes a byte buffer into text, automatically detecting and handling:
 * - UTF-16 Little Endian (BOM: \xFF\xFE)
 * - UTF-16 Big Endian (BOM: \xFE\xFF)
 * - UTF-8 BOM (\xEF\xBB\xBF)
 * - Standard UTF-8
 */
export function decodeTextBuffer(buf: Uint8Array): string {
  if (!buf || buf.length === 0) return '';
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
    return new TextDecoder('utf-16le').decode(buf.subarray(2));
  }
  if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) {
    return new TextDecoder('utf-16be').decode(buf.subarray(2));
  }
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    return new TextDecoder('utf-8').decode(buf.subarray(3));
  }
  return new TextDecoder('utf-8').decode(buf);
}

/**
 * LineAssembler:
 * Assembles lines of text across arbitrary chunk boundaries with zero-copy subarrays.
 * Handles \n, \r\n, and preserves partial lines in a carry buffer.
 */
export class LineAssembler {
  private carry: Uint8Array = new Uint8Array(0);
  private readonly maxLineSize: number = 2 * 1024 * 1024; // 2MB safety ceiling

  /**
   * Processes a new byte chunk and yields each complete line as a Uint8Array slice.
   * Strips trailing \r and \n.
   */
  *pushChunk(chunk: Uint8Array): Generator<Uint8Array, void, unknown> {
    let buf: Uint8Array;
    if (this.carry.length > 0) {
      buf = new Uint8Array(this.carry.length + chunk.length);
      buf.set(this.carry, 0);
      buf.set(chunk, this.carry.length);
      this.carry = new Uint8Array(0);
    } else {
      buf = chunk;
    }

    const len = buf.length;
    let lineStart = 0;

    for (let i = 0; i < len; i++) {
      if (buf[i] === LF) {
        let lineEnd = i;
        if (lineEnd > lineStart && buf[lineEnd - 1] === CR) {
          lineEnd--;
        }
        yield buf.subarray(lineStart, lineEnd);
        lineStart = i + 1;
      }
    }

    if (lineStart < len) {
      // Retain remainder in carry buffer
      this.carry = buf.slice(lineStart);
      if (this.carry.length > this.maxLineSize) {
        throw new GenomicsError('Line length exceeds maximum limit of 2MB.', {
          errorCode: GenomicsErrorCode.ERR_PARSE_FILE_MALFORMED,
          subsystem: 'STREAM_PARSER',
          suggestedSolution: 'Ensure the file is a valid tabular DNA file with standard line breaks.'
        });
      }
    }
  }

  /**
   * Flushes the final carry buffer at EOF, yielding any remaining line.
   */
  *flush(): Generator<Uint8Array, void, unknown> {
    if (this.carry.length > 0) {
      let end = this.carry.length;
      if (end > 0 && this.carry[end - 1] === CR) end--;
      if (end > 0) {
        yield this.carry.subarray(0, end);
      }
      this.carry = new Uint8Array(0);
    }
  }
}
