import FileUpload from '@/components/upload/FileUpload';

export const metadata = {
  title: 'Scan Files - AI-Based Virus Checker',
  description: 'Upload and scan files up to 1GB for potential viruses and security threats',
};

export default function ScanPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4 text-primary">Scan Your Files</h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Upload any file up to 1GB and our AI will analyze it for malware, viruses, and other security threats.
        </p>
      </div>
      
      <FileUpload />
      
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold">1</span>
            </div>
            <h3 className="font-medium mb-2">Upload File</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Drag & drop or select any file up to 1GB
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold">2</span>
            </div>
            <h3 className="font-medium mb-2">AI Analysis</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Our advanced AI scans for known and unknown threats
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold">3</span>
            </div>
            <h3 className="font-medium mb-2">Get Results</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receive a detailed security report about your file
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 