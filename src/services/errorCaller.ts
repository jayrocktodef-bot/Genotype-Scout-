/**
 * errorCaller.ts — Unified Genomics Error Caller & Diagnostic Telemetry Framework
 * 
 * Provides structured error categorization, exact diagnostic codes, subsystem tags,
 * automated error serialization for Web Worker postMessage boundaries, and 
 * formatted telemetry export for user troubleshooting and developer debugging.
 */

export type GenomicsSubsystem =
  | 'FILE_INGESTION'
  | 'ZIP_DECOMPRESSION'
  | 'HEALTH_VALIDATION'
  | 'DELIMITER_SNIFFING'
  | 'COLUMN_DETECTION'
  | 'STREAM_PARSER'
  | 'CHUNK_PARSER'
  | 'GENOTYPE_WORKER'
  | 'ANALYSIS_WORKER'
  | 'ENGINE_EXECUTION'
  | 'POPULATION_ORACLE'
  | 'CHROMOSOME_PAINTER'
  | 'INDEXED_DB';

export enum GenomicsErrorCode {
  // File Format & Health
  ERR_FILE_EMPTY = 'ERR_FILE_EMPTY',
  ERR_FILE_PDF_DOCUMENT = 'ERR_FILE_PDF_DOCUMENT',
  ERR_FILE_HTML_WEBPAGE = 'ERR_FILE_HTML_WEBPAGE',
  ERR_FILE_JSON_PAYLOAD = 'ERR_FILE_JSON_PAYLOAD',
  ERR_FILE_EXCEL_SPREADSHEET = 'ERR_FILE_EXCEL_SPREADSHEET',
  ERR_FILE_BINARY_SEQUENCE = 'ERR_FILE_BINARY_SEQUENCE',
  
  // Decompression & Archives
  ERR_ZIP_DECOMPRESS_BOMB = 'ERR_ZIP_DECOMPRESS_BOMB',
  ERR_ZIP_CORRUPTED = 'ERR_ZIP_CORRUPTED',
  ERR_ZIP_NO_GENOMES = 'ERR_ZIP_NO_GENOMES',
  ERR_ZIP_EXTRACTION_FAILED = 'ERR_ZIP_EXTRACTION_FAILED',
  ERR_ARCHIVE_UNSUPPORTED = 'ERR_ARCHIVE_UNSUPPORTED',

  // Column & Delimiter Parsing
  ERR_PARSE_UNKNOWN_COLUMNS = 'ERR_PARSE_UNKNOWN_COLUMNS',
  ERR_PARSE_ZERO_SNPS = 'ERR_PARSE_ZERO_SNPS',
  ERR_PARSE_MALFORMED_DELIMITER = 'ERR_PARSE_MALFORMED_DELIMITER',
  ERR_PARSE_CORRUPT_ROWS = 'ERR_PARSE_CORRUPT_ROWS',
  ERR_PARSE_FILE_MALFORMED = 'ERR_PARSE_FILE_MALFORMED',
  ERR_PARSE_COLUMN_MISMATCH = 'ERR_PARSE_COLUMN_MISMATCH',
  ERR_PARSE_NO_MATCHING_AIMS = 'ERR_PARSE_NO_MATCHING_AIMS',
  ERR_PARSE_DECOMPRESSION_THRESHOLD = 'ERR_PARSE_DECOMPRESSION_THRESHOLD',
  ERR_PARSE_HEADER_MISSING_COLUMNS = 'ERR_PARSE_HEADER_MISSING_COLUMNS',
  ERR_PARSE_GENOTYPE_UNRECOGNIZED = 'ERR_PARSE_GENOTYPE_UNRECOGNIZED',

  // VCF & Specialized Genomic Variant Parsing
  ERR_VCF_GVCF_NONREF_ONLY = 'ERR_VCF_GVCF_NONREF_ONLY',
  ERR_VCF_SYMBOLIC_ALT_ONLY = 'ERR_VCF_SYMBOLIC_ALT_ONLY',
  ERR_VCF_ALL_NO_CALL = 'ERR_VCF_ALL_NO_CALL',
  ERR_VCF_MULTI_SAMPLE_UNRESOLVED = 'ERR_VCF_MULTI_SAMPLE_UNRESOLVED',

  // Worker Orchestration & Concurrency
  ERR_WORKER_WATCHDOG_TIMEOUT = 'ERR_WORKER_WATCHDOG_TIMEOUT',
  ERR_WORKER_UNHANDLED_EXCEPTION = 'ERR_WORKER_UNHANDLED_EXCEPTION',
  ERR_WORKER_UNHANDLED_REJECTION = 'ERR_WORKER_UNHANDLED_REJECTION',
  ERR_WORKER_COMMUNICATION = 'ERR_WORKER_COMMUNICATION',
  ERR_WORKER_INITIALIZATION_FAILED = 'ERR_WORKER_INITIALIZATION_FAILED',

  // Analysis Engines
  ERR_ENGINE_FAILED = 'ERR_ENGINE_FAILED',
  ERR_ENGINE_MATRIX_DEGENERACY = 'ERR_ENGINE_MATRIX_DEGENERACY',
  ERR_BATCH_NO_VALID_FILES = 'ERR_BATCH_NO_VALID_FILES',

  // Fallback
  ERR_UNKNOWN = 'ERR_UNKNOWN'
}

export interface GenomicsDiagnosticDetails {
  errorCode: string;
  legacyCode?: string;
  errorCategory: string;
  subsystem: GenomicsSubsystem;
  fileName?: string;
  fileSize?: number;
  bytesProcessed?: number;
  linesTotal?: number;
  linesCommented?: number;
  linesMalformed?: number;
  snpsParsed?: number;
  headerPreview?: string;
  failedEngine?: string;
  suggestedSolution: string;
  technicalMessage?: string;
  stackTrace?: string;
  timestamp: string;
  context?: Record<string, any>;
  format?: string;
  chip?: string;
  bytesTotal?: number;
}

export interface SerializedGenomicsError {
  name: string;
  message: string;
  code: string;
  legacyCode?: string;
  category: string;
  subsystem: GenomicsSubsystem;
  details: GenomicsDiagnosticDetails;
}

/**
 * Standard Genomics Error class extending native Error with full diagnostic telemetry.
 */
export class GenomicsError extends Error {
  code: string;
  legacyCode?: string;
  category: string;
  subsystem: GenomicsSubsystem;
  details: GenomicsDiagnosticDetails;

  constructor(
    message: string, 
    details: Partial<GenomicsDiagnosticDetails> & { 
      errorCode: string; 
      suggestedSolution?: string; 
      subsystem?: GenomicsSubsystem;
      errorCategory?: string;
    }
  ) {
    super(message);
    this.name = 'GenomicsError';
    this.code = details.errorCode;
    this.legacyCode = details.legacyCode || 'ERR-4025FGD1';
    this.category = details.errorCategory || 'Genomic Processing Error';
    this.subsystem = details.subsystem || 'STREAM_PARSER';
    
    this.details = {
      errorCode: this.code,
      legacyCode: this.legacyCode,
      errorCategory: this.category,
      subsystem: this.subsystem,
      fileName: details.fileName,
      fileSize: details.fileSize ?? details.bytesTotal,
      bytesProcessed: details.bytesProcessed,
      linesTotal: details.linesTotal,
      linesCommented: details.linesCommented,
      linesMalformed: details.linesMalformed,
      snpsParsed: details.snpsParsed,
      headerPreview: details.headerPreview,
      failedEngine: details.failedEngine,
      suggestedSolution: details.suggestedSolution || 'Ensure your raw data export is an unedited genotype file (.txt, .csv, .vcf, .zip) from 23andMe, AncestryDNA, MyHeritage, or FamilyTreeDNA.',
      technicalMessage: details.technicalMessage || message,
      stackTrace: details.stackTrace || this.stack,
      timestamp: details.timestamp || new Date().toISOString(),
      context: details.context,
      format: details.format,
      chip: details.chip,
      bytesTotal: details.bytesTotal ?? details.fileSize
    };
  }

  toStructured(): SerializedGenomicsError {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      legacyCode: this.legacyCode,
      category: this.category,
      subsystem: this.subsystem,
      details: { ...this.details }
    };
  }
}

/**
 * Explicit Error Caller to throw rich, categorized errors with zero speculation.
 */
export function callGenomicsError(
  subsystem: GenomicsSubsystem,
  errorCode: GenomicsErrorCode | string,
  message: string,
  options: Partial<GenomicsDiagnosticDetails> = {}
): never {
  throw new GenomicsError(message, {
    subsystem,
    errorCode,
    ...options
  });
}

/**
 * Normalizes any error (Error instance, ErrorEvent, rejection reason, or string)
 * into a serialized, structured-cloneable diagnostic payload.
 */
export function serializeGenomicsError(
  err: any,
  fallbackSubsystem: GenomicsSubsystem = 'GENOTYPE_WORKER',
  fallbackContext: Record<string, any> = {}
): SerializedGenomicsError {
  if (err instanceof GenomicsError) {
    const s = err.toStructured();
    if (fallbackContext && Object.keys(fallbackContext).length > 0) {
      s.details.context = { ...(s.details.context || {}), ...fallbackContext };
    }
    return s;
  }

  // If already structured error object from a worker
  if (err && typeof err === 'object' && err.details && err.code) {
    return {
      name: err.name || 'GenomicsError',
      message: err.message || 'Genomic processing error',
      code: err.code,
      legacyCode: err.legacyCode || err.details.legacyCode || 'ERR-4025FGD1',
      category: err.category || err.details.errorCategory || 'Genomics Error',
      subsystem: err.subsystem || err.details.subsystem || fallbackSubsystem,
      details: {
        ...err.details,
        errorCode: err.code,
        errorCategory: err.category || err.details.errorCategory || 'Genomics Error',
        subsystem: err.subsystem || err.details.subsystem || fallbackSubsystem,
        suggestedSolution: err.details.suggestedSolution || 'Verify your raw data export format.',
        timestamp: err.details.timestamp || new Date().toISOString()
      }
    };
  }

  let rawMessage: string;
  let stack = err instanceof Error ? err.stack : undefined;
  let errorName = err instanceof Error ? err.name : 'Error';
  const extractedContext: Record<string, any> = {};

  if (err instanceof Error) {
    rawMessage = err.message || err.name;
  } else if (typeof err === 'string') {
    rawMessage = err;
  } else if (err && typeof err === 'object') {
    // Check for nested Error or ErrorEvent/Event properties
    const innerError = err.error;
    const isErrorEventOrEvent = err.type === 'error' || 'isTrusted' in err || 'filename' in err;

    if (innerError instanceof Error) {
      rawMessage = innerError.message || innerError.name;
      stack = innerError.stack || stack;
      errorName = innerError.name || errorName;
    } else if (typeof innerError === 'string' && innerError.trim().length > 0) {
      rawMessage = innerError;
    } else if (typeof err.message === 'string' && err.message.trim().length > 0 && err.message !== '{"isTrusted":true}') {
      rawMessage = err.message;
    } else if (isErrorEventOrEvent) {
      const loc = err.filename ? ` (${err.filename}${err.lineno ? `:${err.lineno}` : ''})` : '';
      rawMessage = `Worker thread script initialization or network download failed${loc}.`;
      if (err.filename) extractedContext.filename = err.filename;
      if (err.lineno) extractedContext.lineno = err.lineno;
      if (err.colno) extractedContext.colno = err.colno;
    } else {
      try {
        const jsonStr = JSON.stringify(err);
        if (jsonStr && jsonStr !== '{}' && jsonStr !== '{"isTrusted":true}') {
          rawMessage = jsonStr;
        } else {
          rawMessage = 'Background worker communication or initialization failure.';
        }
      } catch {
        rawMessage = String(err);
      }
    }
  } else {
    rawMessage = err ? String(err) : 'Unknown genomic processing failure.';
  }

  // Ensure rawMessage is never the cryptic JSON {"isTrusted":true}
  if (rawMessage === '{"isTrusted":true}' || rawMessage === '{"isTrusted": true}') {
    rawMessage = 'Worker thread initialization or module script execution failed.';
  }

  // Intelligent classification based on message patterns
  let code = GenomicsErrorCode.ERR_UNKNOWN;
  let category = 'Genomic Processing Error';
  let solution = 'Please refresh the page and try re-uploading your raw genotype file.';
  let subsystem = fallbackSubsystem;

  if (/timeout/i.test(rawMessage) || /watchdog/i.test(rawMessage)) {
    code = GenomicsErrorCode.ERR_WORKER_WATCHDOG_TIMEOUT;
    category = 'Worker Watchdog Timeout';
    solution = 'The genetic analysis worker stopped responding. If your file is a large ZIP bundle, try extracting the text file and uploading it directly.';
    subsystem = 'GENOTYPE_WORKER';
  } else if (/worker.*(init|load|script|module|fetch|download|crash)|(init|load|script|module|fetch|download|crash).*worker|fetch.*module|module.*script|script.*error|isTrusted/i.test(rawMessage)) {
    code = GenomicsErrorCode.ERR_WORKER_INITIALIZATION_FAILED;
    category = 'Worker Script Load Failure';
    solution = 'The background analysis worker could not be loaded or initialized by your browser. Please click "Clear Cache" in the top bar or reload the page.';
    subsystem = 'GENOTYPE_WORKER';
  } else if (/zip|gunzip|decompress/i.test(rawMessage)) {
    code = GenomicsErrorCode.ERR_ZIP_CORRUPTED;
    category = 'Decompression Error';
    solution = 'The archive file could not be unpacked. Try unzipping on your device and uploading the plain .txt or .csv file.';
    subsystem = 'ZIP_DECOMPRESSION';
  } else if (/out of memory|oom|heap/i.test(rawMessage)) {
    code = GenomicsErrorCode.ERR_ZIP_DECOMPRESS_BOMB;
    category = 'Memory Allocation Ceiling';
    solution = 'Your browser ran low on memory processing this file. Close unused tabs and reload.';
    subsystem = 'STREAM_PARSER';
  } else if (/column|header|chrom|pos/i.test(rawMessage)) {
    code = GenomicsErrorCode.ERR_PARSE_UNKNOWN_COLUMNS;
    category = 'Unrecognized Column Structure';
    solution = 'Ensure your file has standard chromosome, position, and genotype columns.';
    subsystem = 'COLUMN_DETECTION';
  } else if (/engine/i.test(rawMessage)) {
    code = GenomicsErrorCode.ERR_ENGINE_FAILED;
    category = 'Calculation Engine Failure';
    solution = 'An internal calculation engine failed on this specimen. Check technical diagnostics.';
    subsystem = 'ENGINE_EXECUTION';
  }

  const mergedContext = {
    ...extractedContext,
    ...(fallbackContext || {})
  };

  return {
    name: errorName,
    message: rawMessage,
    code,
    legacyCode: 'ERR-4025FGD1',
    category,
    subsystem,
    details: {
      errorCode: code,
      legacyCode: 'ERR-4025FGD1',
      errorCategory: category,
      subsystem,
      suggestedSolution: solution,
      technicalMessage: rawMessage,
      stackTrace: stack,
      timestamp: new Date().toISOString(),
      context: mergedContext
    }
  };
}

/**
 * Formats a clean, readable Markdown telemetry report for users to copy.
 */
export function formatDiagnosticTelemetry(err: SerializedGenomicsError | GenomicsError | any): string {
  const structured = serializeGenomicsError(err);
  const d = structured.details;

  let report = `### 🧬 Genotype Scout Diagnostic Telemetry Report\n\n`;
  report += `- **Timestamp**: ${d.timestamp}\n`;
  report += `- **Error Code**: \`${d.errorCode}\` (Legacy Ref: \`${d.legacyCode || 'ERR-4025FGD1'}\`)\n`;
  report += `- **Category**: ${d.errorCategory}\n`;
  report += `- **Subsystem**: \`${d.subsystem}\`\n`;
  report += `- **Message**: ${structured.message}\n`;
  report += `- **Suggested Action**: ${d.suggestedSolution}\n\n`;

  report += `#### File & Processing State\n`;
  if (d.fileName) report += `- **File Name**: ${d.fileName}\n`;
  if (d.fileSize !== undefined) report += `- **File Size**: ${(d.fileSize / (1024 * 1024)).toFixed(2)} MB (${d.fileSize.toLocaleString()} bytes)\n`;
  if (d.bytesProcessed !== undefined) report += `- **Bytes Processed**: ${(d.bytesProcessed / (1024 * 1024)).toFixed(2)} MB\n`;
  if (d.linesTotal !== undefined) report += `- **Total Lines Read**: ${d.linesTotal.toLocaleString()}\n`;
  if (d.linesCommented !== undefined) report += `- **Comment Lines**: ${d.linesCommented.toLocaleString()}\n`;
  if (d.linesMalformed !== undefined) report += `- **Malformed Lines**: ${d.linesMalformed.toLocaleString()}\n`;
  if (d.snpsParsed !== undefined) report += `- **SNPs Matched**: ${d.snpsParsed.toLocaleString()}\n`;
  if (d.format) report += `- **Detected Format**: ${d.format}\n`;
  if (d.chip) report += `- **Detected Chip**: ${d.chip}\n`;
  if (d.failedEngine) report += `- **Failed Engine**: \`${d.failedEngine}\`\n`;

  if (d.headerPreview) {
    report += `\n#### Raw File Header Preview\n\`\`\`text\n${d.headerPreview}\n\`\`\`\n`;
  }

  if (d.stackTrace) {
    report += `\n#### Stack Trace\n\`\`\`text\n${d.stackTrace}\n\`\`\`\n`;
  }

  return report;
}
