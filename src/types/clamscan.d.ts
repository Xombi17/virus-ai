declare module 'clamscan' {
  namespace NodeClam {
    interface ClamScanConfig {
      clamdscan?: {
        socket?: string | null;
        host?: string;
        port?: number;
        path?: string;
        configFile?: string;
        localFallback?: boolean;
        active?: boolean;
        timeout?: number;
      };
      clamscan?: {
        path?: string;
        configFile?: string;
        dbPath?: string;
        active?: boolean;
      };
      preference?: 'clamdscan' | 'clamscan';
      removeInfected?: boolean;
      quarantineInfected?: string;
      scanRecursively?: boolean;
      debugMode?: boolean;
    }

    interface ScanResult {
      file: string;
      isInfected: boolean;
      viruses: string[];
    }

    interface MultiScanResult {
      isInfected: boolean;
      viruses: string[];
      scannedFiles: string[];
      goodFiles: string[];
      badFiles: {
        [key: string]: string[];
      };
      errors: {
        [key: string]: Error;
      };
    }

    class ClamScan {
      constructor();
      init(options?: ClamScanConfig): Promise<ClamScan>;
      scanFile(filePath: string): Promise<ScanResult>;
      scanFiles(filePaths: string[]): Promise<MultiScanResult>;
      scanDir(dirPath: string): Promise<MultiScanResult>;
      isInfected(filePath: string): Promise<boolean>;
      passthrough(
        stream: NodeJS.ReadableStream, 
        options?: { stdout?: NodeJS.WritableStream; stderr?: NodeJS.WritableStream }
      ): NodeJS.ReadableStream;
    }
  }

  const NodeClam: {
    ClamScan: typeof NodeClam.ClamScan;
  };

  export = NodeClam;
} 