'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    
    // Here we would normally upload the file to our backend API
    // For now, let's simulate a file upload delay
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // After "uploading", redirect to a results page with a dummy id
      const dummyScanId = "scan-" + Math.random().toString(36).substring(2, 15);
      router.push(`/results/${dummyScanId}`);
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
    }
  }, [file, router]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div 
          className={`border-2 border-dashed rounded-lg p-10 text-center ${
            isDragging 
              ? 'border-secondary bg-secondary/10' 
              : 'border-gray-300 dark:border-gray-700'
          } transition-all cursor-pointer`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          
          {!file ? (
            <div className="py-4">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold mb-2">
                Drag & Drop Files Here
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                or click to browse (files up to 1GB)
              </p>
            </div>
          ) : (
            <div className="py-4">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">
                {file.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
        
        {file && (
          <div className="mt-6 text-center">
            <button
              type="submit"
              disabled={isUploading}
              className={`bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? 'Uploading...' : 'Scan Now'}
            </button>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default FileUpload; 