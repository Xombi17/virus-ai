'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [scanResult, setScanResult] = useState<{
    fileName: string;
    fileSize: string;
    scanDate: string;
    threatLevel: 'clean' | 'suspicious' | 'malicious';
    threats: Array<{ name: string; category: string; severity: string }>;
  } | null>(null);

  useEffect(() => {
    // Simulate loading scan results from an API
    const timer = setTimeout(() => {
      // Mock data - in a real app, we'd fetch this from an API
      setScanResult({
        fileName: 'document.pdf',
        fileSize: '1.24 MB',
        scanDate: new Date().toLocaleString(),
        threatLevel: Math.random() > 0.7 ? 'malicious' : Math.random() > 0.4 ? 'suspicious' : 'clean',
        threats: [
          {
            name: 'Trojan.PDF.Exploit',
            category: 'Trojan',
            severity: 'High',
          },
          {
            name: 'Suspicious.Script.Obfuscated',
            category: 'Suspicious Behavior',
            severity: 'Medium',
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

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 max-w-md mx-auto mb-4 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 max-w-sm mx-auto mb-12 rounded"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 max-w-2xl mx-auto rounded"></div>
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
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors inline-block"
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
            Scan ID: {params.id}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h2 className="text-xl font-bold mb-2">{scanResult.fileName}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Size: {scanResult.fileSize} • Scanned: {scanResult.scanDate}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getThreatLevelColor(
                    scanResult.threatLevel
                  )}`}
                >
                  {scanResult.threatLevel.charAt(0).toUpperCase() + scanResult.threatLevel.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Detected Threats</h3>
            {scanResult.threatLevel === 'clean' ? (
              <div className="text-center py-8">
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

          <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <Link
                href="/scan"
                className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors inline-block text-center mb-4 sm:mb-0"
              >
                Scan Another File
              </Link>
              <button
                className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold py-2 px-6 rounded-full text-sm transition-colors"
                onClick={() => window.print()}
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 