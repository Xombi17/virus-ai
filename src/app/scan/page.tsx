import FileUpload from '@/components/upload/FileUpload';
import PageTransition from '@/components/PageTransition';
import { Metadata } from 'next';
import ClientThreeCanvas from '@/components/ClientThreeCanvas';

export const metadata: Metadata = {
  title: 'Scan Files - AI-Based Virus Checker',
  description: 'Upload and scan files up to 1GB for potential viruses and security threats',
};

export default function ScanPage() {
  return (
    <PageTransition>
      <div className="relative container mx-auto py-12 px-4">
        <ClientThreeCanvas />
          
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Scan Your Files
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Upload any file up to 1GB and our AI will analyze it for malware, viruses, and other security threats.
          </p>
        </div>
        
        <FileUpload />
        
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            <span className="relative inline-block">
              How It Works
              <span className="absolute bottom-0 left-0 w-full h-1 bg-secondary rounded-full transform"></span>
            </span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent z-0 transform group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <span className="text-primary text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Upload File</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Drag & drop or select any file up to 1GB. We support all common file types.
                </p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center relative overflow-hidden group transform md:translate-y-4">
              <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent z-0 transform group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 transition-colors duration-300">
                  <span className="text-secondary text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">AI Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our advanced AI models scan for known and unknown threats, including zero-day vulnerabilities.
                </p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent z-0 transform group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <span className="text-primary text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Get Results</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Receive a detailed security report with threat analysis and recommended actions.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-20 max-w-3xl mx-auto text-center">
          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-inner">
            <h3 className="text-xl font-semibold mb-3">
              Security You Can Trust
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Your files are analyzed with industry-leading security protocols. We don't store your files after scanning.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              By using this service, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
} 