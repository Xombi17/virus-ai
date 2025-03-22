'use client';

import { useState } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard - AI-Based Virus Checker',
  description: 'View your scan history and file analysis results',
};

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

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-primary">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View your scan history and analysis results
            </p>
          </div>
          <Link
            href="/scan"
            className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors inline-block text-center"
          >
            New Scan
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold">Recent Scans</h2>
          </div>

          {scans.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                You haven't scanned any files yet.
              </p>
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
                    <tr key={scan.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{scan.fileName}</div>
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
                        <Link
                          href={`/results/${scan.id}`}
                          className="text-primary hover:text-primary/80 hover:underline"
                        >
                          View Details
                        </Link>
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