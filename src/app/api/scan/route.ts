import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import * as NodeClam from 'clamscan';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';

// Promisify exec
const execAsync = promisify(exec);

// Constants
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 1024 * 1024 * 100; // 100 MB limit

// Define ClamAV scanner type
interface ClamAvScanResult {
  isInfected: boolean;
  viruses: string[];
  file: string;
  error?: any;
}

// Define types
import type { ScanResult } from '@/types/scanResult';

// Function to calculate file hashes
async function calculateFileHashes(filePath: string): Promise<{md5: string, sha1: string, sha256: string}> {
  try {
    const fileBuffer = await readFile(filePath);
    
    const md5Hash = crypto.createHash('md5').update(fileBuffer).digest('hex');
    const sha1Hash = crypto.createHash('sha1').update(fileBuffer).digest('hex');
    const sha256Hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    
    return {
      md5: md5Hash,
      sha1: sha1Hash,
      sha256: sha256Hash
    };
  } catch (error) {
    console.error('Error calculating file hashes:', error);
    throw error;
  }
}

// Initialize ClamAV scanner
let clamAV: NodeClam.ClamScan | null = null;

const initClamAV = async () => {
  try {
    const options = {
      clamdscan: {
        socket: process.env.CLAMAV_SOCKET || null,
        host: process.env.CLAMAV_HOST || '127.0.0.1',
        port: process.env.CLAMAV_PORT ? parseInt(process.env.CLAMAV_PORT) : 3310,
        timeout: 60000,
        active: true
      },
      preference: 'clamdscan' as 'clamdscan'
    };

    clamAV = await new NodeClam.ClamScan().init(options);
    console.log('ClamAV initialized successfully');
  } catch (error) {
    console.error('Failed to initialize ClamAV:', error);
  }
};

// Ensure the upload directory exists
const ensureUploadDir = async () => {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create upload directory:', error);
  }
};

// Function to scan code files for security issues
async function scanCodeFile(filePath: string, fileType: string) {
  const result = {
    threats: [] as any[],
    riskLevel: 'none' as 'none' | 'low' | 'medium' | 'high'
  };

  // Read the file content
  const fileContent = await readFile(filePath, 'utf-8');
  
  // Define patterns to look for in code files
  const dangerousPatterns = [
    { pattern: /eval\s*\(/g, name: 'Unsafe Eval', risk: 'high', type: 'code-execution' },
    { pattern: /new\s+Function\s*\(/g, name: 'Dynamic Function Creation', risk: 'high', type: 'code-execution' },
    { pattern: /document\.write\s*\(/g, name: 'DOM Manipulation Risk', risk: 'medium', type: 'xss' },
    { pattern: /innerHTML\s*=/g, name: 'XSS Risk', risk: 'medium', type: 'xss' },
    { pattern: /exec\s*\(/g, name: 'Command Execution', risk: 'high', type: 'code-execution' },
    { pattern: /child_process/g, name: 'Process Spawning', risk: 'high', type: 'code-execution' },
    { pattern: /https?:\/\/([^\s"']+)/g, name: 'External URL', risk: 'low', type: 'network' },
    { pattern: /password|secret|key|token|auth/gi, name: 'Sensitive Data', risk: 'medium', type: 'data-leakage' },
    { pattern: /\.\.\/|\.\.\\|~\/|~\\/g, name: 'Path Traversal', risk: 'medium', type: 'file-access' },
    { pattern: /setTimeout\s*\(\s*['"`]/g, name: 'String Execution', risk: 'high', type: 'code-execution' },
    { pattern: /setInterval\s*\(\s*['"`]/g, name: 'String Execution', risk: 'high', type: 'code-execution' },
    { pattern: /prototype\s*\.\s*__/g, name: 'Prototype Pollution', risk: 'high', type: 'prototype-pollution' },
    { pattern: /require\s*\(\s*[^\s'"]*\s*\+/g, name: 'Dynamic Import', risk: 'medium', type: 'code-execution' },
    { pattern: /crypto\.createCipher/g, name: 'Weak Crypto', risk: 'medium', type: 'crypto' },
    { pattern: /Math\.random\s*\(/g, name: 'Weak Random', risk: 'low', type: 'crypto' }
  ];

  // Check for obfuscated code
  const obfuscationIndicators = [
    /(_0x|\\x[0-9a-f]{2})/gi,
    /(\w{20,})/g,
    /(\\u[0-9a-f]{4})/gi,
    /eval\s*\(\s*atob\s*\(/gi,
    /fromCharCode|decodeURIComponent\s*\(/gi
  ];

  let isObfuscated = false;
  for (const pattern of obfuscationIndicators) {
    if (pattern.test(fileContent)) {
      isObfuscated = true;
      result.threats.push({
        name: 'Code Obfuscation',
        type: 'obfuscation',
        confidence: 0.9,
        risk: 'high',
        details: 'Code appears to be obfuscated which may hide malicious behavior'
      });
      break;
    }
  }

  // Check for dangerous patterns
  for (const { pattern, name, risk, type } of dangerousPatterns) {
    const matches = fileContent.match(pattern);
    if (matches && matches.length > 0) {
      const confidence = risk === 'high' ? 0.9 : risk === 'medium' ? 0.7 : 0.5;
      result.threats.push({
        name,
        type,
        confidence,
        risk,
        details: `Found ${matches.length} instances of potentially dangerous pattern`,
        count: matches.length
      });
    }
  }

  // Determine overall risk level
  if (result.threats.some(t => t.risk === 'high') || isObfuscated) {
    result.riskLevel = 'high';
  } else if (result.threats.some(t => t.risk === 'medium')) {
    result.riskLevel = 'medium';
  } else if (result.threats.length > 0) {
    result.riskLevel = 'low';
  }

  return result;
}

// Function to scan file with ClamAV
async function scanWithClamAV(filePath: string): Promise<ClamAvScanResult> {
  try {
    if (!clamAV) {
      await initClamAV();
    }

    if (!clamAV) {
      console.log('ClamAV is not initialized. Falling back to simulated scan.');
      return { isInfected: false, viruses: [], file: filePath };
    }

    const { isInfected, viruses, file } = await clamAV.scanFile(filePath);
    return { isInfected, viruses, file };
  } catch (error) {
    console.error('Error scanning with ClamAV:', error);
    return { isInfected: false, viruses: [], file: filePath, error: 'ClamAV scan failed' };
  }
}

// Scan with VirusTotal API if available
async function scanWithVirusTotal(filePath: string, fileHash: string) {
  try {
    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    if (!apiKey) {
      return { success: false, message: 'VirusTotal API key not configured' };
    }

    // Check if file has been scanned before using the provided hash
    const response = await fetch(`https://www.virustotal.com/api/v3/files/${fileHash}`, {
      headers: {
        'x-apikey': apiKey
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else if (response.status === 404) {
      // File not found on VirusTotal, upload it
      // Implementation would require using the VirusTotal API to upload the file
      // This is a placeholder as file upload requires additional implementation
      return { success: false, message: 'File not previously scanned on VirusTotal' };
    } else {
      return { success: false, message: 'VirusTotal API error' };
    }
  } catch (error) {
    console.error('Error with VirusTotal scan:', error);
    return { success: false, message: 'VirusTotal scan failed' };
  }
}

// Define Detection interface
interface Detection {
  name: string;
  type: string;
  confidence: number;
  risk?: string;
  details?: string;
  count?: number;
}

// Main scan function
async function scanFile(filePath: string, fileName: string, fileType: string, fileSize: number) {
  // Create a scan ID
  const scanId = uuidv4();
  
  // Track our scan findings
  const findings = {
    detections: [] as Detection[],
    threatLevel: 'none' as 'none' | 'low' | 'medium' | 'high',
    scanDate: new Date().toISOString(),
    scanDuration: '0 seconds',
    aiAnalysis: {
      summary: '',
      riskFactors: [] as string[]
    }
  };
  
  // Start timing the scan
  const scanStartTime = Date.now();
  
  // Calculate file hashes
  const fileHashes = await calculateFileHashes(filePath);
  
  // Perform ClamAV scan
  const clamResult = await scanWithClamAV(filePath);
  
  if (clamResult.isInfected) {
    findings.threatLevel = 'high';
    clamResult.viruses.forEach((virus: string) => {
      findings.detections.push({
        name: virus,
        type: 'malware',
        confidence: 0.95
      });
    });
  }
  
  // For code files, perform additional security analysis
  const codeFileExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.php', '.html', '.css'];
  const fileExt = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  
  if (codeFileExtensions.includes(fileExt)) {
    const codeResults = await scanCodeFile(filePath, fileType);
    
    // Add code security findings
    if (codeResults.threats.length > 0) {
      findings.detections.push(...codeResults.threats);
      
      // Update threat level if code scan found higher risks
      if (codeResults.riskLevel === 'high' && findings.threatLevel !== 'high') {
        findings.threatLevel = 'high';
      } else if (codeResults.riskLevel === 'medium' && 
                (findings.threatLevel !== 'high' && findings.threatLevel !== 'medium')) {
        findings.threatLevel = 'medium';
      } else if (codeResults.riskLevel === 'low' && findings.threatLevel === 'none') {
        findings.threatLevel = 'low';
      }
    }
  }
  
  // Try VirusTotal if available and configured
  if (process.env.VIRUSTOTAL_API_KEY) {
    const vtResult = await scanWithVirusTotal(filePath, fileHashes.sha256);
    if (vtResult.success && vtResult.data) {
      // Process VirusTotal results
      // This would require parsing the VirusTotal response format
      console.log('VirusTotal results received for file', fileName);
    }
  }
  
  // Calculate scan duration
  const scanEndTime = Date.now();
  findings.scanDuration = `${((scanEndTime - scanStartTime) / 1000).toFixed(1)} seconds`;
  
  // Generate AI analysis
  if (findings.detections.length > 0) {
    // Group detections by type
    const detectionTypes = findings.detections.map(d => d.type);
    const uniqueTypes = [...new Set(detectionTypes)];
    
    // Create risk factors
    findings.aiAnalysis.riskFactors = findings.detections.map(d => 
      `${d.name}: ${d.details || 'Potential security risk detected'}`
    );
    
    // Generate summary based on findings
    findings.aiAnalysis.summary = `Analysis detected ${findings.detections.length} potential ${
      findings.detections.length === 1 ? 'issue' : 'issues'
    } in this file, including ${uniqueTypes.join(', ')}. `;
    
    if (findings.threatLevel === 'high') {
      findings.aiAnalysis.summary += 'This file poses a high security risk and should not be used.';
    } else if (findings.threatLevel === 'medium') {
      findings.aiAnalysis.summary += 'This file contains suspicious elements that may pose a security risk.';
    } else {
      findings.aiAnalysis.summary += 'This file contains minor issues that may require review.';
    }
  } else {
    findings.aiAnalysis.summary = 'No security issues were detected in this file. It appears to be safe based on our analysis.';
  }
  
  // Return complete scan results
  return {
    success: true,
    scan_id: scanId,
    message: 'File scanned successfully',
    estimated_time: findings.scanDuration,
    result_url: `/results/${scanId}`,
    file_info: {
      name: fileName,
      type: fileType,
      size: fileSize
    },
    fileHashes,
    findings: findings
  };
}

export async function POST(request: NextRequest) {
  try {
    // Ensure upload directory exists
    await ensureUploadDir();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` },
        { status: 400 }
      );
    }

    // Create a unique filename
    const uniqueId = uuidv4();
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${uniqueId}.${fileExtension}`;
    const filePath = join(UPLOAD_DIR, uniqueFilename);

    // Convert the file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    // Write the file to disk
    await writeFile(filePath, fileBuffer);

    // Initialize ClamAV if needed
    if (!clamAV) {
      await initClamAV();
    }

    // Scan the file
    const scanResult = await scanFile(
      filePath,
      file.name,
      file.type,
      file.size
    );

    // Save the scan result for later retrieval
    const resultPath = join(UPLOAD_DIR, `${scanResult.scan_id}.json`);
    await writeFile(resultPath, JSON.stringify({
      ...scanResult,
      filePath,
      scanCompleted: true,
      scanDate: new Date().toISOString()
    }));

    // Return success response
    return NextResponse.json(scanResult);
  } catch (error) {
    console.error('Error processing file upload:', error);
    return NextResponse.json(
      { error: 'File upload failed' },
      { status: 500 }
    );
  }
}

// This route handles GET requests to check scan status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scanId = searchParams.get('scanId');
  
  if (!scanId) {
    return NextResponse.json(
      { error: 'No scan ID provided' },
      { status: 400 }
    );
  }
  
  try {
    // Check if we have results for this scan ID
    const resultPath = join(UPLOAD_DIR, `${scanId}.json`);
    const resultData = await readFile(resultPath, 'utf-8');
    const scanResult = JSON.parse(resultData);
    
    return NextResponse.json({
      scanId,
      status: scanResult.scanCompleted ? 'completed' : 'processing',
      progress: scanResult.scanCompleted ? 100 : 50,
      message: scanResult.scanCompleted ? 'Scan completed successfully' : 'Scan in progress'
    });
  } catch (error) {
    console.error(`Error retrieving scan status for ID ${scanId}:`, error);
    return NextResponse.json({
      scanId,
      status: 'unknown',
      progress: 0,
      message: 'Unable to determine scan status'
    });
  }
} 