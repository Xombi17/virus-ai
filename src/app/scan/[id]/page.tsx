'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaFileMedical, FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaSkull } from 'react-icons/fa';

interface ScanResult {
  scanId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  scanDate: string;
  threatLevel: 'clean' | 'low' | 'medium' | 'high' | 'critical';
  detections: {
    clamav?: {
      infected: boolean;
      viruses: string[];
    };
    codeAnalysis?: {
      issues: Array<{
        type: string;
        description: string;
        severity: 'low' | 'medium' | 'high';
        lineNumber?: number;
      }>;
    };
    virusTotal?: {
      positives: number;
      total: number;
      permalink: string;
    };
  };
  fileHashes?: {
    md5: string;
    sha1: string;
    sha256: string;
  };
  aiAnalysis: {
    summary: string;
    riskFactors?: string[];
    recommendations?: string[];
  };
}

const getThreatIcon = (threatLevel: string) => {
  switch (threatLevel) {
    case 'clean':
      return <FaCheckCircle className="text-green-500 text-3xl" />;
    case 'low':
      return <FaShieldAlt className="text-blue-500 text-3xl" />;
    case 'medium':
      return <FaExclamationTriangle className="text-yellow-500 text-3xl" />;
    case 'high':
      return <FaExclamationTriangle className="text-orange-500 text-3xl" />;
    case 'critical':
      return <FaSkull className="text-red-500 text-3xl" />;
    default:
      return <FaFileMedical className="text-gray-500 text-3xl" />;
  }
};

const getThreatColor = (threatLevel: string) => {
  switch (threatLevel) {
    case 'clean': return 'text-green-500';
    case 'low': return 'text-blue-500';
    case 'medium': return 'text-yellow-500';
    case 'high': return 'text-orange-500';
    case 'critical': return 'text-red-500';
    default: return 'text-gray-500';
  }
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const BasicInfoSection = ({ result }: { result: ScanResult }) => (
  <div className="bg-gray-800 rounded-lg p-4">
    <div className="flex items-center mb-4">
      {getThreatIcon(result.threatLevel)}
      <h2 className={`text-2xl font-bold ml-2 ${getThreatColor(result.threatLevel)}`}>
        {result.threatLevel.charAt(0).toUpperCase() + result.threatLevel.slice(1)} Threat Level
      </h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h3 className="text-gray-400">File Information</h3>
        <p className="text-white"><span className="text-gray-500">Name:</span> {result.fileName}</p>
        <p className="text-white"><span className="text-gray-500">Type:</span> {result.fileType}</p>
        <p className="text-white"><span className="text-gray-500">Size:</span> {formatBytes(result.fileSize)}</p>
      </div>
      <div>
        <h3 className="text-gray-400">Scan Information</h3>
        <p className="text-white"><span className="text-gray-500">Scan ID:</span> {result.scanId}</p>
        <p className="text-white"><span className="text-gray-500">Upload Date:</span> {new Date(result.uploadDate).toLocaleString()}</p>
        <p className="text-white"><span className="text-gray-500">Scan Date:</span> {new Date(result.scanDate).toLocaleString()}</p>
      </div>
    </div>
  </div>
);

const FileHashesSection = ({ hashes }: { hashes?: { md5: string; sha1: string; sha256: string } }) => {
  if (!hashes) return null;
  
  return (
    <div className="mt-6 bg-gray-800 rounded-lg p-4">
      <h3 className="text-xl font-semibold mb-2 text-cyan-400">File Hashes</h3>
      <div className="grid grid-cols-1 gap-2">
        <div className="flex flex-col">
          <span className="text-gray-400">MD5:</span>
          <code className="bg-gray-900 px-2 py-1 rounded text-sm font-mono text-white break-all">{hashes.md5}</code>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-400">SHA-1:</span>
          <code className="bg-gray-900 px-2 py-1 rounded text-sm font-mono text-white break-all">{hashes.sha1}</code>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-400">SHA-256:</span>
          <code className="bg-gray-900 px-2 py-1 rounded text-sm font-mono text-white break-all">{hashes.sha256}</code>
        </div>
      </div>
    </div>
  );
};

const DetectionSection = ({ result }: { result: ScanResult }) => (
  <div className="mt-6 bg-gray-800 rounded-lg p-4">
    <h3 className="text-xl font-semibold mb-4 text-cyan-400">Detection Details</h3>
    
    {result.detections.clamav && (
      <div className="mb-4">
        <h4 className="text-lg font-medium text-white">Antivirus Scan</h4>
        {result.detections.clamav.infected ? (
          <>
            <p className="text-red-500 font-semibold">Malware detected!</p>
            <ul className="list-disc list-inside mt-2 text-white">
              {result.detections.clamav.viruses.map((virus, index) => (
                <li key={index} className="text-red-400">{virus}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-green-500">No threats detected</p>
        )}
      </div>
    )}
    
    {result.detections.codeAnalysis && (
      <div className="mb-4">
        <h4 className="text-lg font-medium text-white">Code Analysis</h4>
        {result.detections.codeAnalysis.issues.length > 0 ? (
          <>
            <p className="text-yellow-500 font-semibold">{result.detections.codeAnalysis.issues.length} issues found</p>
            <ul className="list-none mt-2">
              {result.detections.codeAnalysis.issues.map((issue, index) => (
                <li key={index} className="mb-2 bg-gray-900 p-2 rounded">
                  <span className={`font-bold ${issue.severity === 'high' ? 'text-red-500' : issue.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`}>
                    {issue.type}
                  </span>
                  <p className="text-white text-sm">{issue.description}</p>
                  {issue.lineNumber && <p className="text-gray-400 text-xs">Line: {issue.lineNumber}</p>}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-green-500">No code issues detected</p>
        )}
      </div>
    )}
    
    {result.detections.virusTotal && (
      <div>
        <h4 className="text-lg font-medium text-white">VirusTotal Results</h4>
        <p className="text-white">
          <span className="text-gray-400">Detection rate:</span> 
          <span className={`font-semibold ${result.detections.virusTotal.positives > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {result.detections.virusTotal.positives} / {result.detections.virusTotal.total}
          </span>
        </p>
        {result.detections.virusTotal.permalink && (
          <a href={result.detections.virusTotal.permalink} target="_blank" rel="noopener noreferrer" 
            className="text-cyan-400 hover:text-cyan-300 underline mt-1 inline-block">
            View full report on VirusTotal
          </a>
        )}
      </div>
    )}
  </div>
);

const AIAnalysisSection = ({ analysis }: { analysis: ScanResult['aiAnalysis'] }) => (
  <div className="mt-6 bg-gray-800 rounded-lg p-4">
    <h3 className="text-xl font-semibold mb-2 text-cyan-400">AI Analysis</h3>
    <p className="text-white mb-4">{analysis.summary}</p>
    
    {analysis.riskFactors && analysis.riskFactors.length > 0 && (
      <>
        <h4 className="text-lg font-medium text-white mb-2">Risk Factors</h4>
        <ul className="list-disc list-inside mb-4">
          {analysis.riskFactors.map((factor, index) => (
            <li key={index} className="text-red-400">{factor}</li>
          ))}
        </ul>
      </>
    )}
    
    {analysis.recommendations && analysis.recommendations.length > 0 && (
      <>
        <h4 className="text-lg font-medium text-white mb-2">Recommendations</h4>
        <ul className="list-disc list-inside">
          {analysis.recommendations.map((rec, index) => (
            <li key={index} className="text-green-400">{rec}</li>
          ))}
        </ul>
      </>
    )}
  </div>
);

export default function ScanResultPage({ params }: { params: { id: string } }) {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/scan/results/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch scan result');
        }
        
        const data = await response.json();
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResult();
  }, [params.id]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-3/4 mb-6"></div>
            <div className="h-64 bg-gray-800 rounded mb-6"></div>
            <div className="h-40 bg-gray-800 rounded mb-6"></div>
            <div className="h-32 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-center">
          <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Error Loading Scan Result</h1>
          <p className="mb-6">{error || 'Scan result not found'}</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded inline-flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Return to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Scan Results</h1>
        
        <BasicInfoSection result={result} />
        <FileHashesSection hashes={result.fileHashes} />
        <DetectionSection result={result} />
        <AIAnalysisSection analysis={result.aiAnalysis} />
      </div>
    </div>
  );
} 