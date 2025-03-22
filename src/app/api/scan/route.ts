import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

// Constants
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 1024 * 1024 * 100; // 100 MB limit

// Ensure the upload directory exists
const ensureUploadDir = async () => {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create upload directory:', error);
  }
};

// Function to simulate VirusTotal API scan (in a real app, this would call VirusTotal API)
async function simulateScan(filePath: string, fileName: string, fileType: string, fileSize: number) {
  // In a production app, you would send the file to VirusTotal API
  // For demo purposes, we're simulating a response
  
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // Create a scan ID
  const scanId = uuidv4();
  
  // Return simulated results
  return {
    success: true,
    scan_id: scanId,
    message: 'File uploaded and scan initiated',
    estimated_time: '30 seconds',
    result_url: `/results/${scanId}`,
    file_info: {
      name: fileName,
      type: fileType,
      size: fileSize
    }
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

    // Scan the file (simulated for demo)
    const scanResult = await simulateScan(
      filePath,
      file.name,
      file.type,
      file.size
    );

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
  
  // In a real application, you would query your database for the scan status
  // For this demo, we'll just return a mock result
  return NextResponse.json({
    scanId,
    status: 'completed', // or 'pending', 'processing', 'failed'
    progress: 100, // Percentage complete
    message: 'Scan completed successfully'
  });
} 