import { describe, it, expect } from 'vitest';
import {
  GenomicsError,
  GenomicsErrorCode,
  callGenomicsError,
  serializeGenomicsError,
  formatDiagnosticTelemetry,
  GenomicsSubsystem
} from './errorCaller';

describe('errorCaller framework', () => {
  describe('callGenomicsError and GenomicsError', () => {
    it('throws a GenomicsError with the specified code, subsystem, and details', () => {
      expect(() => {
        callGenomicsError(
          'HEALTH_VALIDATION',
          GenomicsErrorCode.ERR_FILE_EMPTY,
          'The provided genomic file is empty (0 bytes).',
          {
            fileName: 'empty_sample.txt',
            bytesTotal: 0,
            suggestedSolution: 'Upload a non-empty genotype file.'
          }
        );
      }).toThrow(GenomicsError);

      try {
        callGenomicsError(
          'HEALTH_VALIDATION',
          GenomicsErrorCode.ERR_FILE_EMPTY,
          'The provided genomic file is empty (0 bytes).',
          {
            fileName: 'empty_sample.txt',
            bytesTotal: 0,
            suggestedSolution: 'Upload a non-empty genotype file.'
          }
        );
      } catch (e) {
        const err = e as GenomicsError;
        expect(err.name).toBe('GenomicsError');
        expect(err.code).toBe(GenomicsErrorCode.ERR_FILE_EMPTY);
        expect(err.subsystem).toBe('HEALTH_VALIDATION');
        expect(err.legacyCode).toBe('ERR-4025FGD1');
        expect(err.details.fileName).toBe('empty_sample.txt');
        expect(err.details.bytesTotal).toBe(0);
        expect(err.details.suggestedSolution).toBe('Upload a non-empty genotype file.');
      }
    });

    it('converts to a structured cloneable object via toStructured()', () => {
      const err = new GenomicsError('Corrupted ZIP stream', {
        errorCode: GenomicsErrorCode.ERR_ZIP_CORRUPTED,
        subsystem: 'ZIP_DECOMPRESSION',
        fileName: 'corrupt.zip',
        fileSize: 1048576,
        headerPreview: 'PK\\x03\\x04 corrupted bytes'
      });

      const structured = err.toStructured();
      expect(structured.name).toBe('GenomicsError');
      expect(structured.code).toBe(GenomicsErrorCode.ERR_ZIP_CORRUPTED);
      expect(structured.subsystem).toBe('ZIP_DECOMPRESSION');
      expect(structured.details.headerPreview).toContain('PK');
      expect(structured.details.fileSize).toBe(1048576);
    });
  });

  describe('serializeGenomicsError normalization', () => {
    it('serializes a native GenomicsError directly and merges context', () => {
      const original = new GenomicsError('Engine calculation crashed', {
        errorCode: GenomicsErrorCode.ERR_ENGINE_FAILED,
        subsystem: 'ENGINE_EXECUTION',
        failedEngine: 'OracleV3'
      });

      const serialized = serializeGenomicsError(original, 'GENOTYPE_WORKER', { runId: 'run-99' });
      expect(serialized.code).toBe(GenomicsErrorCode.ERR_ENGINE_FAILED);
      expect(serialized.subsystem).toBe('ENGINE_EXECUTION');
      expect(serialized.details.failedEngine).toBe('OracleV3');
      expect(serialized.details.context?.runId).toBe('run-99');
    });

    it('serializes an already structured object received across worker boundary', () => {
      const workerPayload = {
        name: 'GenomicsError',
        message: 'Watchdog timeout triggered',
        code: GenomicsErrorCode.ERR_WORKER_WATCHDOG_TIMEOUT,
        category: 'Worker Watchdog Timeout',
        subsystem: 'GENOTYPE_WORKER' as GenomicsSubsystem,
        details: {
          errorCode: GenomicsErrorCode.ERR_WORKER_WATCHDOG_TIMEOUT,
          errorCategory: 'Worker Watchdog Timeout',
          subsystem: 'GENOTYPE_WORKER' as GenomicsSubsystem,
          suggestedSolution: 'Try extracting the text file and uploading directly.'
        }
      };

      const serialized = serializeGenomicsError(workerPayload);
      expect(serialized.code).toBe(GenomicsErrorCode.ERR_WORKER_WATCHDOG_TIMEOUT);
      expect(serialized.subsystem).toBe('GENOTYPE_WORKER');
      expect(serialized.details.suggestedSolution).toContain('extracting');
    });

    it('intelligently classifies standard Error instances', () => {
      const timeoutErr = new Error('Worker watchdog timeout exceeded after 60s');
      const s1 = serializeGenomicsError(timeoutErr);
      expect(s1.code).toBe(GenomicsErrorCode.ERR_WORKER_WATCHDOG_TIMEOUT);
      expect(s1.subsystem).toBe('GENOTYPE_WORKER');

      const zipErr = new Error('gunzip decompression failed: invalid header');
      const s2 = serializeGenomicsError(zipErr);
      expect(s2.code).toBe(GenomicsErrorCode.ERR_ZIP_CORRUPTED);
      expect(s2.subsystem).toBe('ZIP_DECOMPRESSION');

      const columnErr = new Error('Unable to identify column headers for chromosome, position, and genotype');
      const s3 = serializeGenomicsError(columnErr);
      expect(s3.code).toBe(GenomicsErrorCode.ERR_PARSE_UNKNOWN_COLUMNS);
      expect(s3.subsystem).toBe('COLUMN_DETECTION');

      const oomErr = new Error('JavaScript heap out of memory');
      const s4 = serializeGenomicsError(oomErr);
      expect(s4.code).toBe(GenomicsErrorCode.ERR_ZIP_DECOMPRESS_BOMB);
      expect(s4.subsystem).toBe('STREAM_PARSER');

      const engineErr = new Error('Engine calculation exception in HumanOrigins');
      const s5 = serializeGenomicsError(engineErr);
      expect(s5.code).toBe(GenomicsErrorCode.ERR_ENGINE_FAILED);
      expect(s5.subsystem).toBe('ENGINE_EXECUTION');
    });

    it('serializes string error messages and unhandled rejections', () => {
      const s = serializeGenomicsError('Network communication failed with worker', 'GENOTYPE_WORKER');
      expect(s.message).toBe('Network communication failed with worker');
      expect(s.code).toBe(GenomicsErrorCode.ERR_UNKNOWN);
      expect(s.legacyCode).toBe('ERR-4025FGD1');
      expect(s.subsystem).toBe('GENOTYPE_WORKER');
    });

    it('gracefully handles DOM ErrorEvents and prevents {"isTrusted":true} leaks', () => {
      // Simulates browser ErrorEvent where only isTrusted is an own enumerable property
      const domErrorEvent = Object.create(
        { message: '', filename: 'https://scout.blog/assets/genotypeWorker.js', lineno: 10, colno: 5 },
        { isTrusted: { value: true, enumerable: true }, type: { value: 'error', enumerable: true } }
      );

      const s1 = serializeGenomicsError(domErrorEvent, 'GENOTYPE_WORKER');
      expect(s1.message).not.toContain('{"isTrusted":true}');
      expect(s1.message).toContain('Worker thread script initialization or network download failed');
      expect(s1.code).toBe(GenomicsErrorCode.ERR_WORKER_INITIALIZATION_FAILED);
      expect(s1.subsystem).toBe('GENOTYPE_WORKER');
      expect(s1.details.context?.filename).toBe('https://scout.blog/assets/genotypeWorker.js');
      expect(s1.details.context?.lineno).toBe(10);
      expect(s1.details.suggestedSolution).toContain('Clear Cache');

      // Simulates naked Event object that serializes to {"isTrusted":true}
      const nakedEvent = { isTrusted: true, type: 'error' };
      const s2 = serializeGenomicsError(nakedEvent, 'GENOTYPE_WORKER');
      expect(s2.message).not.toBe('{"isTrusted":true}');
      expect(s2.code).toBe(GenomicsErrorCode.ERR_WORKER_INITIALIZATION_FAILED);

      // Simulates ErrorEvent with explicit error message
      const scriptError = {
        isTrusted: true,
        type: 'error',
        message: 'Failed to fetch dynamically imported module /assets/genotypeWorker-abc.js'
      };
      const s3 = serializeGenomicsError(scriptError, 'GENOTYPE_WORKER');
      expect(s3.message).toContain('Failed to fetch dynamically imported module');
      expect(s3.code).toBe(GenomicsErrorCode.ERR_WORKER_INITIALIZATION_FAILED);

      // Simulates ErrorEvent with an inner Error object
      const innerErrorEvent = {
        isTrusted: true,
        type: 'error',
        error: new Error('Script execution aborted due to heap limit')
      };
      const s4 = serializeGenomicsError(innerErrorEvent, 'GENOTYPE_WORKER');
      expect(s4.message).toContain('heap limit');
      expect(s4.code).toBe(GenomicsErrorCode.ERR_ZIP_DECOMPRESS_BOMB);
    });
  });

  describe('formatDiagnosticTelemetry report generation', () => {
    it('formats a comprehensive Markdown telemetry string for clipboard export', () => {
      const err = new GenomicsError('Failed to parse DNA stream: 0 valid loci identified', {
        errorCode: GenomicsErrorCode.ERR_PARSE_ZERO_SNPS,
        subsystem: 'STREAM_PARSER',
        fileName: 'illumina_raw.txt',
        fileSize: 15728640,
        bytesProcessed: 15728640,
        linesTotal: 650000,
        linesCommented: 15,
        linesMalformed: 649985,
        snpsParsed: 0,
        format: 'Unknown / Malformed',
        chip: 'Unknown',
        failedEngine: undefined,
        headerPreview: '# rsid\\tchromosome\\tposition\\tgenotype\\nrs001\\t1\\t123\\t--',
        suggestedSolution: 'Check that the genotype calls contain valid nucleotides (A, C, G, T).'
      });

      const report = formatDiagnosticTelemetry(err);

      expect(report).toContain('### 🧬 Genotype Scout Diagnostic Telemetry Report');
      expect(report).toContain('- **Error Code**: `ERR_PARSE_ZERO_SNPS`');
      expect(report).toContain('- **Subsystem**: `STREAM_PARSER`');
      expect(report).toContain('- **File Name**: illumina_raw.txt');
      expect(report).toContain('- **Total Lines Read**: 650,000');
      expect(report).toContain('- **Malformed Lines**: 649,985');
      expect(report).toContain('- **SNPs Matched**: 0');
      expect(report).toContain('#### Raw File Header Preview');
      expect(report).toContain('# rsid\\tchromosome\\tposition\\tgenotype');
    });

    it('handles minimal errors without missing property errors', () => {
      const report = formatDiagnosticTelemetry(new Error('Unknown glitch'));
      expect(report).toContain('### 🧬 Genotype Scout Diagnostic Telemetry Report');
      expect(report).toContain('Unknown glitch');
      expect(report).toContain('Suggested Action');
    });
  });
});
