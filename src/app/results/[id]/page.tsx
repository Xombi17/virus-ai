'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ClientAnimatedBackground from '@/components/ClientAnimatedBackground';
import Link from 'next/link';

// Type definitions for our scan results
interface Detection {
  name: string;
  type: string;
  confidence: number;
  risk?: string;
  details?: string;
  count?: number;
}

interface AIAnalysis {
  summary: string;
  riskFactors: string[];
}

interface ScanResult {
  scanId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileMd5?: string;
  fileSha1?: string;
  fileSha256?: string;
  scanDate: string;
  scanDuration?: string;
  threatLevel: 'none' | 'low' | 'medium' | 'high' | 'clean' | 'suspicious' | 'malicious';
  scanStatus: 'pending' | 'processing' | 'completed' | 'failed';
  detectionRatio?: string;
  detections: Detection[];
  aiAnalysis: AIAnalysis;
}

// Function to format bytes to a human-readable format
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Function to format date to a readable format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short'
  }).format(date);
};

// Function to standardize the threat level terminology
const normalizeThreatLevel = (level: string): 'none' | 'low' | 'medium' | 'high' => {
  if (level === 'clean') return 'none';
  if (level === 'suspicious') return 'medium';
  if (level === 'malicious') return 'high';
  return level as 'none' | 'low' | 'medium' | 'high';
};

export default function ResultsPage() {
  const params = useParams();
  const scanId = params.id as string;
  const [results, setResults] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        
        // Fetch the actual scan results from our API
        const response = await fetch(`/api/scan/results/${scanId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch scan results: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Set the results
        setResults(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch scan results');
        setLoading(false);
      }
    };

    fetchResults();
  }, [scanId]);

  // Get threat level color
  const getThreatLevelColor = (level: string) => {
    const normalizedLevel = normalizeThreatLevel(level);
    switch (normalizedLevel) {
      case 'high':
        return 'text-alert';
      case 'medium':
        return 'text-orange-400';
      case 'low':
        return 'text-yellow-400';
      case 'none':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  // Get threat level display text
  const getThreatLevelDisplay = (level: string) => {
    const normalizedLevel = normalizeThreatLevel(level);
    if (normalizedLevel === 'none') return 'Clean';
    return `${normalizedLevel.charAt(0).toUpperCase() + normalizedLevel.slice(1)} Risk`;
  };

  return (
    <main className="min-h-screen flex flex-col">
      <ClientAnimatedBackground />
      
      <div className="flex-1 p-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <Link href="/scan" className="text-secondary hover:text-secondary-light flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Scan
            </Link>
          </div>
          
          <div className="bg-primary-light/20 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <h1 className="text-3xl font-bold mb-4 text-white">
              Scan Results
              <span className="text-sm font-normal ml-2 text-gray-400">
                ID: {scanId}
              </span>
            </h1>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-gray-600 border-t-secondary rounded-full animate-spin mb-4"></div>
                <p className="text-gray-300">Loading scan results...</p>
              </div>
            ) : error ? (
              <div className="bg-alert/20 text-white p-6 rounded-lg border border-alert/30">
                <h2 className="text-xl font-bold mb-2">Error Loading Results</h2>
                <p className="mb-4">{error}</p>
                <Link href="/scan" className="bg-secondary hover:bg-secondary-light text-primary py-2 px-6 rounded-full transition-all inline-block font-medium shadow-neon hover:shadow-neon-hover">
                  Try a New Scan
                </Link>
              </div>
            ) : results ? (
              <>
                {/* Summary Card */}
                <div className="p-6 rounded-lg border border-gray-700 bg-primary-dark/40 mb-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{results.fileName}</h2>
                      <div className="flex flex-wrap items-center mt-2 text-sm text-gray-400">
                        <span className="mr-4">{formatBytes(results.fileSize)}</span>
                        <span className="mr-4">{results.fileType}</span>
                        <span>{formatDate(results.scanDate)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      <div className={`text-lg font-bold uppercase ${getThreatLevelColor(results.threatLevel)}`}>
                        {getThreatLevelDisplay(results.threatLevel)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs">
                      AI-Analyzed
                    </span>
                    {results.detections && results.detections.length > 0 && (
                      <span className="px-3 py-1 rounded-full bg-primary-light/20 text-gray-300 text-xs">
                        {results.detections.length} Detection{results.detections.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    {results.aiAnalysis.riskFactors && results.aiAnalysis.riskFactors.length > 0 && (
                      <span className="px-3 py-1 rounded-full bg-primary-light/20 text-gray-300 text-xs">
                        {results.aiAnalysis.riskFactors.length} Risk Factor{results.aiAnalysis.riskFactors.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Threat Detections - only show if there are detections */}
                {results.detections && results.detections.length > 0 ? (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                      <span className="inline-block mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-alert" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Threat Detections
                    </h2>
                    
                    <div className="overflow-hidden rounded-lg border border-gray-700">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-primary-dark/40">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Threat Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Confidence</th>
                            {results.detections.some(d => d.details) && (
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Details</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-primary-light/10 divide-y divide-gray-700">
                          {results.detections.map((detection, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{detection.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">{detection.type}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2">
                                    <div 
                                      className={`h-2.5 rounded-full ${
                                        detection.confidence > 0.8 ? 'bg-alert' : 
                                        detection.confidence > 0.6 ? 'bg-orange-400' : 
                                        'bg-yellow-400'
                                      }`} 
                                      style={{ width: `${detection.confidence * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-300">{Math.round(detection.confidence * 100)}%</span>
                                </div>
                              </td>
                              {results.detections.some(d => d.details) && (
                                <td className="px-6 py-4 text-sm text-gray-300">
                                  {detection.details || '—'}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : normalizeThreatLevel(results.threatLevel) === 'none' && (
                  <div className="mb-8 p-6 rounded-lg border border-green-600/30 bg-green-900/10">
                    <div className="flex items-center">
                      <div className="text-5xl mr-6">✅</div>
                      <div>
                        <h2 className="text-xl font-semibold text-green-400 mb-2">File is Safe</h2>
                        <p className="text-gray-300">
                          Our AI analysis has determined that this file is clean and does not contain any malware or suspicious code.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* AI Analysis */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                    <span className="inline-block mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                      </svg>
                    </span>
                    AI Analysis
                  </h2>
                  
                  <div className="p-6 rounded-lg border border-gray-700 bg-primary-dark/40 mb-4">
                    <h3 className="text-lg font-medium mb-2 text-white">Summary</h3>
                    <p className="text-gray-300 mb-6">{results.aiAnalysis.summary}</p>
                    
                    {results.aiAnalysis.riskFactors && results.aiAnalysis.riskFactors.length > 0 && (
                      <>
                        <h3 className="text-lg font-medium mb-2 text-white">Risk Factors</h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-1">
                          {results.aiAnalysis.riskFactors.map((factor, index) => (
                            <li key={index}>{factor}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Additional details if available */}
                {(results.fileMd5 || results.fileSha1 || results.fileSha256) && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                      <span className="inline-block mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </span>
                      File Details
                    </h2>
                    
                    <div className="p-6 rounded-lg border border-gray-700 bg-primary-dark/40 mb-4 overflow-x-auto">
                      <table className="min-w-full">
                        <tbody className="divide-y divide-gray-700">
                          {results.scanDuration && (
                            <tr>
                              <td className="px-4 py-3 text-sm font-medium text-gray-400 w-1/4">Scan Duration</td>
                              <td className="px-4 py-3 text-sm text-white">{results.scanDuration}</td>
                            </tr>
                          )}
                          {results.fileMd5 && (
                            <tr>
                              <td className="px-4 py-3 text-sm font-medium text-gray-400 w-1/4">MD5</td>
                              <td className="px-4 py-3 text-sm text-white font-mono">{results.fileMd5}</td>
                            </tr>
                          )}
                          {results.fileSha1 && (
                            <tr>
                              <td className="px-4 py-3 text-sm font-medium text-gray-400 w-1/4">SHA-1</td>
                              <td className="px-4 py-3 text-sm text-white font-mono">{results.fileSha1}</td>
                            </tr>
                          )}
                          {results.fileSha256 && (
                            <tr>
                              <td className="px-4 py-3 text-sm font-medium text-gray-400 w-1/4">SHA-256</td>
                              <td className="px-4 py-3 text-sm text-white font-mono">{results.fileSha256}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-secondary hover:bg-secondary-light text-primary py-2 px-6 rounded-full transition-all shadow-neon hover:shadow-neon-hover font-medium">
                    Download Report
                  </button>
                  <button className="border border-secondary text-secondary hover:bg-secondary/10 py-2 px-6 rounded-full transition-all font-medium">
                    Share Results
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-alert/20 text-white p-6 rounded-lg border border-alert/30">
                <h2 className="text-xl font-bold mb-2">Error Loading Results</h2>
                <p className="mb-4">We couldn't find scan results for ID: {scanId}</p>
                <Link href="/scan" className="bg-secondary hover:bg-secondary-light text-primary py-2 px-6 rounded-full transition-all inline-block font-medium shadow-neon hover:shadow-neon-hover">
                  Try a New Scan
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 