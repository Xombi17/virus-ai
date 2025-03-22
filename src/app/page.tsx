import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
      <div className="max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
          AI-Based <span className="text-secondary">Virus Checker</span>
        </h1>
        <p className="text-xl mb-8 text-foreground max-w-2xl mx-auto">
          Advanced virus detection powered by AI, capable of scanning files up to 1GB with enhanced threat detection.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-secondary text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Large File Support</h3>
            <p className="text-gray-600 dark:text-gray-300">Upload and scan files up to 1GB, far exceeding standard limits.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-secondary text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2">AI Enhancement</h3>
            <p className="text-gray-600 dark:text-gray-300">Machine learning models improve detection rates beyond traditional scanners.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-secondary text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Detailed Reports</h3>
            <p className="text-gray-600 dark:text-gray-300">Comprehensive analysis with shareable results and threat insights.</p>
          </div>
        </div>
        
        <Link 
          href="/scan" 
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors inline-block"
        >
          Start Scanning
        </Link>
      </div>
    </div>
  );
}
