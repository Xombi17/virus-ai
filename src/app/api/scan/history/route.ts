import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

// Path to uploads directory where scan results are stored
const UPLOAD_DIR = join(process.cwd(), 'uploads');

// Interface for history items
interface ScanHistoryItem {
  id: string;
  fileName: string;
  fileType: string;
  scanDate: string;
  threatLevel: 'none' | 'low' | 'medium' | 'high';
  detectionCount: number;
}

export async function GET(request: NextRequest) {
  try {
    // Create uploads directory if it doesn't exist
    try {
      await readdir(UPLOAD_DIR);
    } catch (error) {
      // Return empty history if directory doesn't exist yet
      return NextResponse.json({ scans: [] });
    }

    // Get all files in the directory
    const files = await readdir(UPLOAD_DIR);
    
    // Filter for JSON result files only
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    // Read all scan result files
    const scanPromises = jsonFiles.map(async (file) => {
      try {
        const data = await readFile(join(UPLOAD_DIR, file), 'utf-8');
        const scanResult = JSON.parse(data);
        
        // Only return completed scans
        if (!scanResult.scanCompleted) {
          return null;
        }
        
        // Extract relevant information for history
        return {
          id: scanResult.scan_id,
          fileName: scanResult.file_info.name,
          fileType: scanResult.file_info.type,
          scanDate: scanResult.scanDate,
          threatLevel: scanResult.findings.threatLevel,
          detectionCount: scanResult.findings.detections ? scanResult.findings.detections.length : 0
        } as ScanHistoryItem;
      } catch (error) {
        console.error(`Error reading scan file ${file}:`, error);
        return null;
      }
    });
    
    // Wait for all file reads to complete
    const scans = (await Promise.all(scanPromises)).filter(scan => scan !== null);
    
    // Sort scans by date, newest first
    scans.sort((a, b) => new Date(b!.scanDate).getTime() - new Date(a!.scanDate).getTime());
    
    return NextResponse.json({ scans });
  } catch (error) {
    console.error('Error retrieving scan history:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve scan history', scans: [] },
      { status: 500 }
    );
  }
} 