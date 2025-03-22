'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  // In a real app, this would come from an API or database
  const [scans] = useState([
    {
      id: 'scan-a1b2c3d4e5f6',
      fileName: 'document.pdf',
      fileSize: '1.24 MB',
      scanDate: '2023-03-15 14:30:45',
      threatLevel: 'clean',
    },
    {
      id: 'scan-f6e5d4c3b2a1',
      fileName: 'installation.exe',
      fileSize: '45.8 MB',
      scanDate: '2023-03-14 09:15:22',
      threatLevel: 'malicious',
    },
    {
      id: 'scan-1a2b3c4d5e6f',
      fileName: 'backup.zip',
      fileSize: '156.4 MB',
      scanDate: '2023-03-12 18:45:30',
      threatLevel: 'suspicious',
    },
    {
      id: 'scan-abcdef123456',
      fileName: 'report.docx',
      fileSize: '2.8 MB',
      scanDate: '2023-03-10 11:20:10',
      threatLevel: 'clean',
    },
  ]);

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

  // Calculate stats
  const stats = {
    totalScans: scans.length,
    cleanFiles: scans.filter(scan => scan.threatLevel === 'clean').length,
    suspiciousFiles: scans.filter(scan => scan.threatLevel === 'suspicious').length,
    maliciousFiles: scans.filter(scan => scan.threatLevel === 'malicious').length,
  };

  // Function to get appropriate icon for file type
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
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
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-primary">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View your scan history and analysis results
            </p>
          </div>
          <Link
            href="/scan"
            className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors inline-block text-center shadow-md hover:shadow-lg"
          >
            New Scan
          </Link>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Scans</p>
                <p className="text-2xl font-bold">{stats.totalScans}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Clean Files</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.cleanFiles}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Suspicious Files</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.suspiciousFiles}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Malicious Files</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.maliciousFiles}</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Recent Scans
            </h2>
          </div>

          {scans.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-6xl mb-4">📂</div>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven't scanned any files yet.
              </p>
              <Link
                href="/scan"
                className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors inline-block"
              >
                Scan Your First File
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      File Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Scan Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Result
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {scans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{getFileIcon(scan.fileName)}</span>
                          <div className="text-sm font-medium">{scan.fileName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{scan.fileSize}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{scan.scanDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getThreatLevelColor(
                            scan.threatLevel
                          )}`}
                        >
                          {scan.threatLevel.charAt(0).toUpperCase() + scan.threatLevel.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Link
                            href={`/results/${scan.id}`}
                            className="text-primary hover:text-primary/80 hover:underline"
                          >
                            View Details
                          </Link>
                          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 