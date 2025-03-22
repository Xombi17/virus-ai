'use client';

import { useState, useRef, useCallback } from 'react';
import { MotionDiv } from '@/components/ClientMotion';
import { useRouter } from 'next/navigation';

// Supported file types
const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'application/octet-stream',
  'application/x-msdownload',
  'application/x-executable',
  'text/javascript',
  'application/javascript',
  'text/plain',
  'image/jpeg',
  'image/png'
];

// Maximum file size: 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Format bytes to readable string
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

interface FileUploadProps {
  className?: string;
}

const FileUpload = ({ className }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  // Validate the file
  const validateFile = (fileToValidate: File): boolean => {
    // Check file size
    if (fileToValidate.size > MAX_FILE_SIZE) {
      setErrorMessage(`File size exceeds the maximum allowed size (${formatBytes(MAX_FILE_SIZE)})`);
      return false;
    }

    // Check file type - if it's application/octet-stream, we'll allow it since it's a common fallback
    if (!SUPPORTED_FILE_TYPES.includes(fileToValidate.type) && fileToValidate.type !== 'application/octet-stream') {
      // For executables, sometimes the MIME type is not correctly identified
      if (fileToValidate.name.endsWith('.exe') || fileToValidate.name.endsWith('.dll')) {
        return true;
      }
      
      setErrorMessage('File type not supported. Please upload a document, executable, or archive file.');
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileSelect = useCallback((selectedFile: File) => {
    setErrorMessage(null);
    
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  }, [handleFileSelect]);

  // Upload file to API
  const uploadFile = async () => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const increment = Math.random() * 15;
          const newProgress = prev + increment;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 500);
      
      // Send file to API
      const response = await fetch('/api/scan', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }
      
      setUploadProgress(100);
      
      // Get scan result
      const result = await response.json();
      
      // Wait a moment to show 100% before redirecting
      setTimeout(() => {
        // Redirect to results page
        router.push(result.result_url);
      }, 500);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to upload file');
      setIsUploading(false);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Reset the form
  const resetForm = () => {
    setFile(null);
    setErrorMessage(null);
    setUploadProgress(0);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`p-6 bg-primary-light/10 backdrop-blur-md rounded-xl border border-gray-700 shadow-xl ${className}`}>
      <h2 className="text-2xl font-bold mb-4 text-white text-center">Scan Your File</h2>
      
      {/* Drag and drop area */}
      <div
        className={`mt-6 p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all ${
          isDragging 
            ? 'border-secondary bg-secondary/10' 
            : file 
              ? 'border-green-500 bg-green-500/10' 
              : 'border-gray-600 hover:border-gray-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={file ? undefined : triggerFileInput}
      >
        {isUploading && file ? (
          <div className="py-4">
            <div className="mb-2 text-white">Uploading {file.name}</div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-secondary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="mt-2 text-gray-300 text-sm">{Math.round(uploadProgress)}% Complete</div>
          </div>
        ) : file ? (
          <div className="py-4">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-white font-medium mb-1">{file.name}</div>
            <div className="text-gray-400 text-sm">{formatBytes(file.size)}</div>
          </div>
        ) : (
          <div className="py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="text-white font-medium mb-1">Drag & Drop your file here</div>
            <div className="text-gray-400 text-sm">or click to browse</div>
            <div className="mt-2 text-xs text-gray-500">
              Supported files: EXE, DLL, PDF, DOC, DOCX, XLS, XLSX, JS, TXT, ZIP, RAR
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Maximum file size: {formatBytes(MAX_FILE_SIZE)}
            </div>
          </div>
        )}
        
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileInputChange}
        />
      </div>
      
      {/* Error message */}
      {errorMessage && (
        <MotionDiv
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-alert/20 border border-alert/40 rounded-lg text-white text-sm"
        >
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 text-alert" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        </MotionDiv>
      )}
      
      {/* Action buttons */}
      <div className="mt-6 flex justify-center gap-4">
        {file && !isUploading && (
          <>
            <button
              onClick={uploadFile}
              className="bg-secondary hover:bg-secondary-light text-primary font-medium py-2 px-6 rounded-full transition-all shadow-neon hover:shadow-neon-hover"
            >
              Scan File
            </button>
            <button
              onClick={resetForm}
              className="border border-gray-600 hover:border-gray-400 text-gray-300 font-medium py-2 px-6 rounded-full transition-all"
            >
              Cancel
            </button>
          </>
        )}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-700">
        <h3 className="text-white font-medium mb-2">Our AI-powered scanning protects you from:</h3>
        <ul className="text-gray-300 text-sm space-y-2">
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Malware, Trojans, and Viruses
          </li>
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Ransomware and Cryptojackers
          </li>
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Zero-day Exploits and Advanced Threats
          </li>
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Phishing and Social Engineering
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload; 