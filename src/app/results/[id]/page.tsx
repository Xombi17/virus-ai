'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// More comprehensive result type
interface ScanResultType {
  fileName: string;
  fileSize: string;
  fileMd5: string;
  fileSha1: string;
  scanDate: string;
  scanDuration: string;
  threatLevel: 'clean' | 'suspicious' | 'malicious';
  detectionRatio: string;
  threats: Array<{ 
    name: string; 
    category: string; 
    severity: string;
    description: string;
    detectedBy: string[];
  }>;
}

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [scanResult, setScanResult] = useState<ScanResultType | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate loading scan results from an API
    const timer = setTimeout(() => {
      // Mock data - in a real app, we'd fetch this from an API
      setScanResult({
        fileName: 'document.pdf',
        fileSize: '1.24 MB',
        fileMd5: '5d41402abc4b2a76b9719d911017c592',
        fileSha1: 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
        scanDate: new Date().toLocaleString(),
        scanDuration: '3.2 seconds',
        threatLevel: Math.random() > 0.7 ? 'malicious' : Math.random() > 0.4 ? 'suspicious' : 'clean',
        detectionRatio: '3/68',
        threats: [
          {
            name: 'Trojan.PDF.Exploit',
            category: 'Trojan',
            severity: 'High',
            description: 'This threat exploits vulnerabilities in PDF readers to execute malicious code.',
            detectedBy: ['Engine A', 'Engine B', 'Engine C']
          },
          {
            name: 'Suspicious.Script.Obfuscated',
            category: 'Suspicious Behavior',
            severity: 'Medium',
            description: 'Contains obfuscated script that may be attempting to hide its functionality.',
            detectedBy: ['Engine A', 'Engine D']
          },
        ],
      });
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [params.id]);

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'clean':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'suspicious':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'malicious':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getThreatLevelBg = (level: string) => {
    switch (level) {
      case 'clean':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'suspicious':
        return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'malicious':
        return 'bg-red-50 dark:bg-red-900/20';
      default:
        return 'bg-gray-50 dark:bg-gray-800/50';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 max-w-md mx-auto mb-4 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 max-w-sm mx-auto mb-6 rounded"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 max-w-2xl mx-auto rounded mb-4"></div>
          <div className="flex justify-center gap-4 mt-8">
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!scanResult) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4 text-primary">Scan Not Found</h1>
        <p className="mb-8">The scan result you are looking for does not exist or has expired.</p>
        <Link
          href="/scan"
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors inline-block shadow-md hover:shadow-lg"
        >
          Start a New Scan
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-primary">Scan Results</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Scan ID: <span className="font-mono">{params.id}</span>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Header section with file info and threat level */}
          <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${getThreatLevelBg(scanResult.threatLevel)}`}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h2 className="text-xl font-bold mb-2">{scanResult.fileName}</h2>
                <div className="flex flex-wrap gap-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Size: {scanResult.fileSize}</span>
                  <span>•</span>
                  <span>Scanned: {scanResult.scanDate}</span>
                  <span>•</span>
                  <span>Duration: {scanResult.scanDuration}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getThreatLevelColor(
                    scanResult.threatLevel
                  )}`}
                >
                  {scanResult.threatLevel.charAt(0).toUpperCase() + scanResult.threatLevel.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'details'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('hashes')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'hashes'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Hashes
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-6 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className={`text-6xl mb-2 ${
                      scanResult.threatLevel === 'clean' 
                        ? 'text-green-500' 
                        : scanResult.threatLevel === 'suspicious' 
                          ? 'text-yellow-500' 
                          : 'text-red-500'
                    }`}>
                      {scanResult.threatLevel === 'clean' ? '✅' : scanResult.threatLevel === 'suspicious' ? '⚠️' : '❌'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Verdict</div>
                  </div>
                  <div className="h-16 border-r border-gray-300 dark:border-gray-700 hidden sm:block"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">{scanResult.detectionRatio}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Detection Rate</div>
                  </div>
                  <div className="h-16 border-r border-gray-300 dark:border-gray-700 hidden sm:block"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">{scanResult.threats.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Threats Found</div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-4">Detected Threats</h3>
                {scanResult.threatLevel === 'clean' ? (
                  <div className="text-center py-8 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-6xl mb-4">✅</div>
                    <p className="text-xl text-green-600 dark:text-green-400 font-medium">
                      No threats detected
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      This file appears to be safe and clean
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                          <th className="px-4 py-2 text-left">Threat Name</th>
                          <th className="px-4 py-2 text-left">Category</th>
                          <th className="px-4 py-2 text-left">Severity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scanResult.threats.map((threat, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-200 dark:border-gray-700"
                          >
                            <td className="px-4 py-3">{threat.name}</td>
                            <td className="px-4 py-3">{threat.category}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                  threat.severity === 'High'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    : threat.severity === 'Medium'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                }`}
                              >
                                {threat.severity}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Detailed Analysis</h3>
                {scanResult.threatLevel === 'clean' ? (
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                    <p className="text-center text-gray-600 dark:text-gray-400">
                      No threats were detected in this file. The file has been analyzed by our AI and multiple scanning engines, and appears to be safe.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {scanResult.threats.map((threat, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-lg mb-2">{threat.name}</h4>
                        <div className="mb-3">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold mr-2 ${
                              threat.severity === 'High'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : threat.severity === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}
                          >
                            {threat.severity}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Category: {threat.category}
                          </span>
                        </div>
                        <p className="text-sm mb-3">{threat.description}</p>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Detected by:</p>
                          <div className="flex flex-wrap gap-2">
                            {threat.detectedBy.map((engine, i) => (
                              <span 
                                key={i} 
                                className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded"
                              >
                                {engine}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'hashes' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">File Information</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">File Name</p>
                    <p className="font-mono text-sm">{scanResult.fileName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">File Size</p>
                    <p className="font-mono text-sm">{scanResult.fileSize}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">MD5</p>
                    <p className="font-mono text-sm break-all">{scanResult.fileMd5}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">SHA1</p>
                    <p className="font-mono text-sm break-all">{scanResult.fileSha1}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Scan Date</p>
                    <p className="font-mono text-sm">{scanResult.scanDate}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <Link
                href="/scan"
                className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors inline-block text-center mb-4 sm:mb-0 shadow-md hover:shadow-lg"
              >
                Scan Another File
              </Link>
              <div className="flex space-x-2">
                <button
                  className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold py-2 px-6 rounded-full text-sm transition-colors"
                  onClick={() => window.print()}
                >
                  Download Report
                </button>
                <button
                  className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold py-2 px-6 rounded-full text-sm transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 