'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Simulated upload progress
  useEffect(() => {
    if (isUploading && uploadProgress < 100) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newValue = prev + Math.floor(Math.random() * 10);
          return newValue > 100 ? 100 : newValue;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isUploading, uploadProgress]);

  useEffect(() => {
    if (uploadProgress === 100) {
      // Wait a moment at 100% before redirecting
      const timer = setTimeout(() => {
        const dummyScanId = "scan-" + Math.random().toString(36).substring(2, 15);
        router.push(`/results/${dummyScanId}`);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [uploadProgress, router]);

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

  const validateFile = (file: File) => {
    // Size limit check (1GB = 1024 * 1024 * 1024 bytes)
    const maxSize = 1 * 1024 * 1024 * 1024; 
    if (file.size > maxSize) {
      setError(`File size exceeds 1GB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    // Here we would normally upload the file to our backend API
    // But for now, the progress is simulated in the useEffect
  }, [file]);

  const getFileIcon = () => {
    if (!file) return '📁';
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) {
      return '🖼️';
    } else if (['pdf'].includes(extension || '')) {
      return '📄';
    } else if (['doc', 'docx', 'txt', 'rtf'].includes(extension || '')) {
      return '📝';
    } else if (['xls', 'xlsx', 'csv'].includes(extension || '')) {
      return '📊';
    } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
      return '🗄️';
    } else if (['exe', 'msi', 'app'].includes(extension || '')) {
      return '⚙️';
    }
    
    return '📄';
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <motion.div 
          className={`border-2 border-dashed rounded-lg p-10 text-center transition-all ${
            isDragging 
              ? 'border-secondary bg-secondary/10' 
              : error
                ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                : 'border-gray-300 dark:border-gray-700'
          } ${isUploading ? 'opacity-75' : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-500'}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && document.getElementById('file-input')?.click()}
          whileHover={!isUploading ? { scale: 1.01, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" } : {}}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          
          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div 
                className="py-8"
                key="uploading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="text-6xl mb-4"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  🔍
                </motion.div>
                <h3 className="text-2xl font-bold mb-4">
                  Uploading and preparing for scan...
                </h3>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full mb-2 overflow-hidden">
                  <motion.div 
                    className="bg-secondary h-full rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {uploadProgress}% complete
                </p>
              </motion.div>
            ) : (
              <>
                {!file ? (
                  <motion.div 
                    className="py-10"
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div 
                      className="text-8xl mb-6"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    >
                      {getFileIcon()}
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4">
                      Drag & Drop Files Here
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      or click to browse (files up to 1GB)
                    </p>
                    
                    <AnimatePresence>
                      {error && (
                        <motion.div 
                          className="text-red-600 dark:text-red-400 mt-4 px-6 py-3 bg-red-50 dark:bg-red-900/30 rounded-lg inline-block"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <p>{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="py-10"
                    key="file-selected"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div 
                      className="text-8xl mb-6"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0, -5, 0],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {getFileIcon()}
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4">
                      {file.name}
                    </h3>
                    <motion.div 
                      className="inline-flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="mr-2">{file.type || 'Unknown type'}</span>
                      <span>•</span>
                      <span className="ml-2">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </motion.div>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </motion.div>
        
        <AnimatePresence>
          {file && !isUploading && (
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                type="submit"
                disabled={isUploading}
                className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Scan Now
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setFile(null)}
                className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:underline focus:outline-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          By uploading a file, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
        </motion.div>
      </form>
    </div>
  );
};

export default FileUpload; 