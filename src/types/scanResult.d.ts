export interface ScanResult {
  scanId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  scanDate: string;
  threatLevel: 'clean' | 'low' | 'medium' | 'high' | 'critical';
  detections: {
    clamav?: {
      infected: boolean;
      viruses: string[];
    };
    codeAnalysis?: {
      issues: Array<{
        type: string;
        description: string;
        severity: 'low' | 'medium' | 'high';
        lineNumber?: number;
      }>;
    };
    virusTotal?: {
      positives: number;
      total: number;
      permalink: string;
    };
  };
  fileHashes?: {
    md5: string;
    sha1: string;
    sha256: string;
  };
  aiAnalysis: {
    summary: string;
    riskFactors?: string[];
    recommendations?: string[];
  };
} 