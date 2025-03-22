'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ClientAnimatedBackground from '@/components/ClientAnimatedBackground';
import { MotionDiv } from '@/components/ClientMotion';

// Mock data for dashboard
interface ScanHistoryItem {
  id: string;
  fileName: string;
  fileType: string;
  scanDate: string;
  threatLevel: 'none' | 'low' | 'medium' | 'high';
  detectionCount: number;
}

interface DashboardStats {
  totalScans: number;
  threatsDetected: number;
  lastScanDate: string;
  riskScore: number;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'settings'>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data including scan history
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // Fetch scan history from our API
        const response = await fetch('/api/scan/history');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch scan history: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Calculate dashboard stats from the scan history
        const scans = data.scans || [];
        
        if (scans.length > 0) {
          // Sort by date, newest first
          scans.sort((a: ScanHistoryItem, b: ScanHistoryItem) => 
            new Date(b.scanDate).getTime() - new Date(a.scanDate).getTime()
          );
          
          // Calculate statistics
          const totalScans = scans.length;
          const threatsDetected = scans.reduce((sum: number, scan: ScanHistoryItem) => 
            sum + (scan.threatLevel !== 'none' ? scan.detectionCount : 0), 0
          );
          
          const lastScanDate = scans[0].scanDate;
          
          // Calculate risk score based on threat levels and detection counts
          // Higher weight for recent scans and higher threat levels
          const weights = { high: 1.0, medium: 0.6, low: 0.3, none: 0 };
          const maxScanWeightFactor = 10; // Most recent scan has 10x more weight
          
          let weightedThreatSum = 0;
          let totalWeight = 0;
          
          scans.forEach((scan: ScanHistoryItem, index: number) => {
            // Recent scans have more weight (decays exponentially)
            const recencyWeight = Math.max(1, maxScanWeightFactor * Math.exp(-index * 0.3));
            // Threat level weight
            const threatWeight = weights[scan.threatLevel] * scan.detectionCount || 0.01;
            
            weightedThreatSum += threatWeight * recencyWeight;
            totalWeight += recencyWeight;
          });
          
          // Calculate final risk score (0-100)
          const riskScore = Math.min(100, Math.round((weightedThreatSum / totalWeight) * 100));
          
          setStats({
            totalScans,
            threatsDetected,
            lastScanDate,
            riskScore
          });
          
          setScanHistory(scans);
        } else {
          // No scans found, use default empty stats
          setStats({
            totalScans: 0,
            threatsDetected: 0,
            lastScanDate: new Date().toISOString(),
            riskScore: 0
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        
        // Fallback to mock data
        // Mock stats data
        const mockStats: DashboardStats = {
          totalScans: 23,
          threatsDetected: 7,
          lastScanDate: new Date().toISOString(),
          riskScore: 18, // percentage
        };
        
        // Mock scan history
        const mockHistory: ScanHistoryItem[] = [
          {
            id: 'scan-1234-abcd',
            fileName: 'quarterly_report.pdf',
            fileType: 'application/pdf',
            scanDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            threatLevel: 'none',
            detectionCount: 0
          },
          {
            id: 'scan-5678-efgh',
            fileName: 'invoice_attachment.exe',
            fileType: 'application/x-msdownload',
            scanDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            threatLevel: 'high',
            detectionCount: 3
          },
          {
            id: 'scan-9012-ijkl',
            fileName: 'marketing_presentation.pptx',
            fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            scanDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            threatLevel: 'none',
            detectionCount: 0
          },
          {
            id: 'scan-3456-mnop',
            fileName: 'software_update.zip',
            fileType: 'application/zip',
            scanDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            threatLevel: 'medium',
            detectionCount: 1
          },
          {
            id: 'scan-7890-qrst',
            fileName: 'budget_2023.xlsx',
            fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            scanDate: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            threatLevel: 'low',
            detectionCount: 1
          }
        ];
        
        setStats(mockStats);
        setScanHistory(mockHistory);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  // Get threat level styling
  const getThreatLevelStyle = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-alert/20 text-alert';
      case 'medium':
        return 'bg-orange-500/20 text-orange-400';
      case 'low':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'none':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  // Get display text for threat level
  const getThreatLevelText = (level: string) => {
    switch (level) {
      case 'high':
        return 'High Risk';
      case 'medium':
        return 'Medium Risk';
      case 'low':
        return 'Low Risk';
      case 'none':
        return 'Clean';
      default:
        return 'Unknown';
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <ClientAnimatedBackground />
      
      <div className="flex-1 p-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Security Dashboard</h1>
              <p className="text-gray-400">Monitor your scan history and security status</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                href="/scan"
                className="bg-secondary hover:bg-secondary-light text-primary py-2 px-6 rounded-full transition-all inline-block font-medium shadow-neon hover:shadow-neon-hover"
              >
                New Scan
              </Link>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mb-6 border-b border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 font-medium transition-all ${
                  activeTab === 'overview' 
                    ? 'text-secondary border-b-2 border-secondary' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 font-medium transition-all ${
                  activeTab === 'history' 
                    ? 'text-secondary border-b-2 border-secondary' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Scan History
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 font-medium transition-all ${
                  activeTab === 'settings' 
                    ? 'text-secondary border-b-2 border-secondary' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Settings
              </button>
            </div>
          </div>
          
          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-gray-600 border-t-secondary rounded-full animate-spin mb-4"></div>
              <p className="text-gray-300">Loading dashboard data...</p>
            </div>
          ) : (
            <div>
              {activeTab === 'overview' && stats && (
                <div>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <MotionDiv
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-primary-light/20 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
                    >
                      <div className="text-gray-400 mb-2 text-sm font-medium">Total Scans</div>
                      <div className="text-3xl font-bold text-white">{stats.totalScans}</div>
                    </MotionDiv>
                    
                    <MotionDiv
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-primary-light/20 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
                    >
                      <div className="text-gray-400 mb-2 text-sm font-medium">Threats Detected</div>
                      <div className="text-3xl font-bold text-white">{stats.threatsDetected}</div>
                    </MotionDiv>
                    
                    <MotionDiv
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-primary-light/20 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
                    >
                      <div className="text-gray-400 mb-2 text-sm font-medium">Last Scan</div>
                      <div className="text-xl font-bold text-white">{formatDate(stats.lastScanDate)}</div>
                    </MotionDiv>
                    
                    <MotionDiv
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-primary-light/20 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
                    >
                      <div className="text-gray-400 mb-2 text-sm font-medium">Risk Score</div>
                      <div className="flex items-center">
                        <div className="text-3xl font-bold text-white mr-2">{stats.riskScore}%</div>
                        <div className={`text-sm px-2 py-1 rounded-full ${
                          stats.riskScore > 50 ? 'bg-alert/20 text-alert' : 
                          stats.riskScore > 25 ? 'bg-orange-500/20 text-orange-400' : 
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {stats.riskScore > 50 ? 'High' : stats.riskScore > 25 ? 'Medium' : 'Low'}
                        </div>
                      </div>
                    </MotionDiv>
                  </div>
                  
                  {/* Recent Activity */}
                  <div className="bg-primary-light/20 backdrop-blur-sm rounded-xl p-6 border border-gray-800 mb-8">
                    <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
                    
                    {scanHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-lg font-medium text-white mb-2">No scan history yet</h3>
                        <p className="text-gray-400 mb-6">Start scanning files to build your security history</p>
                        <Link href="/scan" className="bg-secondary hover:bg-secondary-light text-primary py-2 px-6 rounded-full transition-all inline-block font-medium shadow-neon hover:shadow-neon-hover">
                          Start a New Scan
                        </Link>
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-lg border border-gray-700">
                        <table className="min-w-full divide-y divide-gray-700">
                          <thead className="bg-primary-dark/40">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">File</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                            </tr>
                          </thead>
                          <tbody className="bg-primary-light/10 divide-y divide-gray-700">
                            {scanHistory.slice(0, 3).map((scan) => (
                              <tr key={scan.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-white">{scan.fileName}</div>
                                  <div className="text-xs text-gray-400">{scan.fileType.split('/').pop()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {formatDate(scan.scanDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs rounded-full ${getThreatLevelStyle(scan.threatLevel)}`}>
                                    {getThreatLevelText(scan.threatLevel)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                  <Link href={`/results/${scan.id}`} className="text-secondary hover:text-secondary-light">
                                    View Details
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    
                    {scanHistory.length > 3 && (
                      <div className="mt-4 text-center">
                        <button 
                          onClick={() => setActiveTab('history')}
                          className="text-secondary hover:text-secondary-light font-medium"
                        >
                          View All
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Security Tips */}
                  <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-primary-light/20 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
                  >
                    <h2 className="text-xl font-semibold text-white mb-4">Security Tips</h2>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Always scan email attachments</h3>
                          <p className="text-gray-400 text-sm">Email attachments are a common vector for malware. Always scan before opening.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Verify downloads from official sources</h3>
                          <p className="text-gray-400 text-sm">Always download software from official websites and verify checksums when available.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Keep your software updated</h3>
                          <p className="text-gray-400 text-sm">Regular updates patch security vulnerabilities that could be exploited by malware.</p>
                        </div>
                      </div>
                    </div>
                  </MotionDiv>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="bg-primary-light/20 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                  <h2 className="text-xl font-semibold text-white mb-6">Scan History</h2>
                  
                  {scanHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📊</div>
                      <h3 className="text-lg font-medium text-white mb-2">No scan history yet</h3>
                      <p className="text-gray-400 mb-6">Start scanning files to build your security history</p>
                      <Link 
                        href="/scan"
                        className="bg-secondary hover:bg-secondary-light text-primary py-2 px-6 rounded-full transition-all inline-block font-medium shadow-neon hover:shadow-neon-hover"
                      >
                        Start a New Scan
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-700">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-primary-dark/40">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">File</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Detections</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-primary-light/10 divide-y divide-gray-700">
                          {scanHistory.map((scan) => (
                            <tr key={scan.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-white">{scan.fileName}</div>
                                <div className="text-xs text-gray-400">{scan.fileType.split('/').pop()}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {formatDate(scan.scanDate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${getThreatLevelStyle(scan.threatLevel)}`}>
                                  {getThreatLevelText(scan.threatLevel)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {scan.detectionCount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                <Link href={`/results/${scan.id}`} className="text-secondary hover:text-secondary-light">
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
              )}
              
              {activeTab === 'settings' && (
                <div className="bg-primary-light/20 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                  <h2 className="text-xl font-semibold text-white mb-6">Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Scan Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">Auto-scan Downloads</h4>
                            <p className="text-sm text-gray-400">Automatically scan files when downloaded</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">Enhanced Protection</h4>
                            <p className="text-sm text-gray-400">Use advanced heuristic analysis</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">Threat Notifications</h4>
                            <p className="text-sm text-gray-400">Receive notifications for detected threats</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="text-lg font-medium text-white mb-4">Scanning Engine Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">ClamAV Engine</h4>
                            <p className="text-sm text-gray-400">Use ClamAV for virus detection</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">Code Analysis</h4>
                            <p className="text-sm text-gray-400">Scan code files for security vulnerabilities</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">VirusTotal Integration</h4>
                            <p className="text-sm text-gray-400">Check files with VirusTotal database</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="text-lg font-medium text-white mb-4">API Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            API Key
                          </label>
                          <div className="flex">
                            <input 
                              type="password" 
                              className="bg-primary-dark/40 border border-gray-700 rounded-l-md px-4 py-2 w-full text-white" 
                              value="••••••••••••••••••••••••••••••"
                              readOnly
                            />
                            <button className="bg-primary-dark border border-gray-700 border-l-0 rounded-r-md px-4 text-white">
                              View
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-gray-400">Your API key for programmatic access to the scanning service</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Webhook URL
                          </label>
                          <input 
                            type="text" 
                            className="bg-primary-dark/40 border border-gray-700 rounded-md px-4 py-2 w-full text-white" 
                            placeholder="https://your-domain.com/webhook"
                          />
                          <p className="mt-1 text-xs text-gray-400">Receive scan results via webhook (optional)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-6 flex justify-end">
                      <button className="bg-secondary hover:bg-secondary-light text-primary py-2 px-6 rounded-full transition-all font-medium shadow-neon hover:shadow-neon-hover">
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard; 