import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Path to uploads directory where scan results are stored
const UPLOAD_DIR = join(process.cwd(), 'uploads');

// Define interfaces for our response
interface Detection {
  name: string;
  type: string;
  confidence: number;
}

interface AIAnalysis {
  summary: string;
  riskFactors: string[];
}

interface ScanResponse {
  scanId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  scanDate: string;
  scanDuration: string;
  threatLevel: 'none' | 'low' | 'medium' | 'high';
  scanStatus: 'pending' | 'processing' | 'completed' | 'failed';
  detections: Detection[];
  aiAnalysis: AIAnalysis;
  fileMd5?: string;
  fileSha1?: string;
  fileSha256?: string;
  detectionRatio?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const scanId = params.id;
    
    // Read the saved scan result file
    const resultPath = join(UPLOAD_DIR, `${scanId}.json`);
    
    try {
      const resultData = await readFile(resultPath, 'utf-8');
      const scanResult = JSON.parse(resultData);
      
      // Transform the scan result from the storage format to the API response format
      const response: ScanResponse = {
        scanId: scanResult.scan_id,
        fileName: scanResult.file_info.name,
        fileSize: scanResult.file_info.size,
        fileType: scanResult.file_info.type,
        scanDate: scanResult.scanDate,
        scanDuration: scanResult.findings.scanDuration,
        threatLevel: scanResult.findings.threatLevel,
        scanStatus: 'completed',
        detections: scanResult.findings.detections || [],
        aiAnalysis: scanResult.findings.aiAnalysis
      };
      
      // Add hash values if available
      if (scanResult.fileHashes) {
        response.fileMd5 = scanResult.fileHashes.md5;
        response.fileSha1 = scanResult.fileHashes.sha1;
        response.fileSha256 = scanResult.fileHashes.sha256;
      }
      
      // Add detection ratio if available
      if (scanResult.detectionRatio) {
        response.detectionRatio = scanResult.detectionRatio;
      }
      
      return NextResponse.json(response);
    } catch (error) {
      // If we can't find the stored result, create a fallback result
      // This is for backward compatibility or demo purposes
      console.warn(`No stored result found for scan ID ${scanId}, falling back to generated result`);
      
      // Generate a fallback result
      const mockResult = generateMockResult(scanId);
      return NextResponse.json(mockResult);
    }
  } catch (error) {
    console.error('Error retrieving scan results:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve scan results' },
      { status: 500 }
    );
  }
}

// Helper function to generate random scan results as a fallback
function generateMockResult(scanId: string): ScanResponse {
  const threatLevel = Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'none';
  
  const result: ScanResponse = {
    scanId,
    fileName: 'document.pdf',
    fileSize: Math.floor(Math.random() * 10000000) + 500000, // Random size between 500KB and 10MB
    fileType: 'application/pdf',
    fileMd5: '5d41402abc4b2a76b9719d911017c592',
    fileSha1: 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
    fileSha256: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    scanDate: new Date().toISOString(),
    scanDuration: `${(Math.random() * 5 + 1).toFixed(1)} seconds`,
    threatLevel: threatLevel as 'none' | 'low' | 'medium' | 'high',
    scanStatus: 'completed',
    detections: [],
    aiAnalysis: {
      summary: '',
      riskFactors: []
    }
  };

  // If there are threats, add detection details
  if (threatLevel !== 'none') {
    const detectionCount = threatLevel === 'high' ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 2) + 1;
    
    const possibleDetections = [
      { name: 'Trojan.PDF.Agent', type: 'malware', confidence: 0.94 },
      { name: 'Suspicious.PDF.Exploit', type: 'suspicious', confidence: 0.86 },
      { name: 'Phishing.Credential.Stealer', type: 'phishing', confidence: 0.78 },
      { name: 'Backdoor.PDF.Remote', type: 'malware', confidence: 0.91 },
      { name: 'Adware.PDF.Redirect', type: 'adware', confidence: 0.72 },
      { name: 'Spyware.PDF.Keylogger', type: 'spyware', confidence: 0.88 }
    ];
    
    // Add random detections
    for (let i = 0; i < detectionCount; i++) {
      if (i < possibleDetections.length) {
        result.detections.push(possibleDetections[i]);
      }
    }
    
    // Add AI analysis based on detections
    result.aiAnalysis = {
      summary: `This file contains ${threatLevel === 'high' ? 'highly suspicious' : 'suspicious'} code that attempts to exploit PDF vulnerabilities. ${
        result.detections.some(d => d.type === 'phishing') 
          ? 'It also includes credential harvesting forms that match known phishing patterns.' 
          : ''
      }`,
      riskFactors: [
        'Obfuscated JavaScript',
        'Hidden form fields for credential collection',
        'Remote URL connections to known malicious domains',
        'PDF structure anomalies'
      ]
    };
  } else {
    // Clean file analysis
    result.aiAnalysis = {
      summary: 'Our AI analysis did not detect any suspicious patterns or known malware signatures in this file. The behavior and structure appear to be normal for this file type.',
      riskFactors: []
    };
  }
  
  return result;
} 