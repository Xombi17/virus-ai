'use client';

import { MotionDiv, MotionH1, MotionP } from "@/components/ClientMotion";
import ClientHeroSection from "@/components/ClientHeroSection";
import ClientAnimatedBackground from "@/components/ClientAnimatedBackground";
import ClientParallaxSection from "@/components/ClientParallaxSection";
import ClientAnimatedButton from "@/components/ClientAnimatedButton";

const ClientHome = () => {
  return (
    <>
      <ClientAnimatedBackground />
      <div className="flex flex-col items-center min-h-[80vh] p-8">
        <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left md:pr-8">
            <MotionH1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-primary">AI-Based</span> <br />
              <span className="text-secondary">Virus Checker</span>
            </MotionH1>
            
            <MotionP 
              className="text-xl mb-8 text-foreground max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Advanced virus detection powered by AI, capable of scanning files
              up to 1GB with enhanced threat detection.
            </MotionP>
            
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <ClientAnimatedButton href="/scan" variant="primary" size="lg">
                Start Scanning
              </ClientAnimatedButton>
              
              <ClientAnimatedButton href="/dashboard" variant="outline" size="lg" className="ml-4">
                View Dashboard
              </ClientAnimatedButton>
            </MotionDiv>
          </div>
          
          <ClientHeroSection />
        </div>
      </div>
      
      {/* Features Section */}
      <MotionDiv 
        className="py-20 bg-gray-50 dark:bg-gray-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="text-primary">Advanced</span> <span className="text-secondary">Features</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <MotionDiv 
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-secondary text-5xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold mb-4">Large File Support</h3>
              <p className="text-gray-600 dark:text-gray-300">Upload and scan files up to 1GB, far exceeding standard limits of most online scanners.</p>
            </MotionDiv>
            
            <MotionDiv 
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-secondary text-5xl mb-6">🧠</div>
              <h3 className="text-2xl font-bold mb-4">AI Enhancement</h3>
              <p className="text-gray-600 dark:text-gray-300">Machine learning models improve detection rates beyond traditional scanners for unknown threats.</p>
            </MotionDiv>
            
            <MotionDiv 
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-secondary text-5xl mb-6">📊</div>
              <h3 className="text-2xl font-bold mb-4">Detailed Reports</h3>
              <p className="text-gray-600 dark:text-gray-300">Comprehensive analysis with shareable results and threat insights for better security decisions.</p>
            </MotionDiv>
          </div>
        </div>
      </MotionDiv>
      
      {/* Parallax Section */}
      <ClientParallaxSection
        title="Advanced Threat Detection"
        subtitle="Our AI models can detect even the most sophisticated threats, including zero-day exploits and polymorphic malware."
        backgroundImage="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
        strength={400}
      >
        <ClientAnimatedButton href="/scan" variant="secondary" size="lg">
          Try It Now
        </ClientAnimatedButton>
      </ClientParallaxSection>
      
      {/* Stats Section */}
      <MotionDiv 
        className="py-20 bg-white dark:bg-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="text-primary">Why</span> <span className="text-secondary">Choose Us</span>
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <MotionDiv
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-primary mb-2">99.8%</div>
              <div className="text-gray-600 dark:text-gray-300">Detection Rate</div>
            </MotionDiv>
            
            <MotionDiv
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-primary mb-2">1GB</div>
              <div className="text-gray-600 dark:text-gray-300">Max File Size</div>
            </MotionDiv>
            
            <MotionDiv
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-300">Cloud Scanning</div>
            </MotionDiv>
            
            <MotionDiv
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-primary mb-2">∞</div>
              <div className="text-gray-600 dark:text-gray-300">Free Scans</div>
            </MotionDiv>
          </div>
        </div>
      </MotionDiv>
    </>
  );
};

export default ClientHome; 