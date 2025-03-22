import { NextRequest, NextResponse } from 'next/server';

// In a real app, this would come from a database
// For our demo, we'll simulate stored results
const simulatedResults: Record<string, any> = {};

// Helper function to generate random scan results for demo
function generateMockResult(scanId: string) {
  const threatLevel = Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'none';
  
  const result = {
    scanId,
    fileName: 'document.pdf',
    fileSize: Math.floor(Math.random() * 10000000) + 500000, // Random size between 500KB and 10MB
    fileType: 'application/pdf',
    fileMd5: '5d41402abc4b2a76b9719d911017c592',
    fileSha1: 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
    fileSha256: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    scanDate: new Date().toISOString(),
    scanDuration: `${(Math.random() * 5 + 1).toFixed(1)} seconds`,
    threatLevel,
    scanStatus: 'completed',
    detections: [] as any[],
    aiAnalysis: {
      summary: '',
      riskFactors: [] as string[]
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const scanId = params.id;
    
    // In a real application, you would fetch the results from your database
    // For this demo, we'll generate mock results if they don't exist yet
    if (!simulatedResults[scanId]) {
      simulatedResults[scanId] = generateMockResult(scanId);
    }
    
    const result = simulatedResults[scanId];
    
    if (!result) {
      return NextResponse.json(
        { error: 'Scan result not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error retrieving scan results:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve scan results' },
      { status: 500 }
    );
  }
} 