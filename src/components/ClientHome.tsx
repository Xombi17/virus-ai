'use client';

import { MotionDiv, MotionH1, MotionP } from "@/components/ClientMotion";
import ClientHeroSection from "@/components/ClientHeroSection";
import ClientAnimatedBackground from "@/components/ClientAnimatedBackground";
import ClientParallaxSection from "@/components/ClientParallaxSection";
import ClientAnimatedButton from "@/components/ClientAnimatedButton";
import { useEffect, useState } from "react";

const ClientHome = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <ClientAnimatedBackground />
      
      {/* Hero Section with Cybersecurity Mesh Look */}
      <div className="relative min-h-[90vh] overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-cyber-grid bg-[length:40px_40px] opacity-20"></div>
        <div className="absolute inset-0 bg-cyber-glow"></div>
        
        <div className="relative flex flex-col items-center justify-center min-h-[90vh] p-6 md:p-8">
          <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left md:pr-8 z-10">
              <MotionDiv
                className="mb-4 inline-block bg-accent-dark/20 backdrop-blur-sm px-4 py-1 rounded-full border border-accent/30"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-accent font-mono text-sm">
                  Advanced AI-Powered Security
                </span>
              </MotionDiv>
              
              <MotionH1 
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-white">Detect.</span> <br />
                <span className="text-secondary bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">Analyze.</span> <br />
                <span className="text-accent">Protect.</span>
              </MotionH1>
              
              <MotionP 
                className="text-xl mb-10 text-gray-300 max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Advanced virus detection powered by AI that can scan files
                up to 1GB and identify threats conventional scanners miss.
              </MotionP>
              
              <MotionDiv
                className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <ClientAnimatedButton 
                  href="/scan" 
                  variant="primary" 
                  size="lg"
                  className="bg-secondary hover:bg-secondary-light text-primary w-full sm:w-auto shadow-neon hover:shadow-neon-hover"
                >
                  Scan Now
                </ClientAnimatedButton>
                
                <ClientAnimatedButton 
                  href="/dashboard" 
                  variant="outline" 
                  size="lg" 
                  className="border-secondary text-secondary hover:bg-secondary/10 w-full sm:w-auto"
                >
                  View Dashboard
                </ClientAnimatedButton>
              </MotionDiv>
              
              <MotionDiv
                className="mt-12 pt-8 border-t border-gray-800 flex items-center justify-center md:justify-start gap-8 text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-secondary mr-2 animate-pulse"></div>
                  <span>Real-time Protection</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse"></div>
                  <span>Advanced AI</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-alert mr-2 animate-pulse"></div>
                  <span>User Privacy</span>
                </div>
              </MotionDiv>
            </div>
            
            <div className="md:w-1/2 mt-12 md:mt-0">
              <ClientHeroSection />
            </div>
          </div>
          
          {/* Scroll indicator */}
          <MotionDiv 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: scrolled ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-gray-400 text-sm mb-2">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center p-1">
              <div className="w-1 h-2 bg-secondary rounded-full animate-bounce"></div>
            </div>
          </MotionDiv>
        </div>
      </div>
      
      {/* Trust Indicators */}
      <div className="py-12 bg-primary-dark text-center">
        <div className="max-w-7xl mx-auto px-6">
          <MotionP
            className="text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            TRUSTED BY SECURITY PROFESSIONALS WORLDWIDE
          </MotionP>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-70">
            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="h-12 text-2xl font-bold text-white">Securitech</div>
            </MotionDiv>
            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="h-12 text-2xl font-bold text-white">CyberFlex</div>
            </MotionDiv>
            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="h-12 text-2xl font-bold text-white">NexusGuard</div>
            </MotionDiv>
            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="h-12 text-2xl font-bold text-white">ProtonShield</div>
            </MotionDiv>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <MotionDiv 
        className="py-24 bg-gradient-to-b from-primary to-primary-dark"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <MotionP
              className="text-secondary font-mono mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              HIGH-PERFORMANCE FEATURES
            </MotionP>
            
            <MotionH1
              className="text-3xl md:text-4xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="text-white">Advanced </span>
              <span className="text-secondary">Protection </span>
              <span className="text-white">Technology</span>
            </MotionH1>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <MotionDiv 
              className="bg-primary-light/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 relative overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-secondary-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <div className="text-secondary text-4xl mb-6 group-hover:text-secondary-light transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Large File Support</h3>
              <p className="text-gray-400">Upload and scan files up to 1GB, far exceeding standard limits of most online scanners.</p>
            </MotionDiv>
            
            <MotionDiv 
              className="bg-primary-light/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 relative overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <div className="text-accent text-4xl mb-6 group-hover:text-accent-light transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                  <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                  <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-9a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100 1.5.75.75 0 000-1.5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">AI Enhancement</h3>
              <p className="text-gray-400">Machine learning models improve detection rates beyond traditional scanners for unknown threats.</p>
            </MotionDiv>
            
            <MotionDiv 
              className="bg-primary-light/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 relative overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-alert to-alert-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <div className="text-alert text-4xl mb-6 group-hover:text-alert-light transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                  <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Detailed Reports</h3>
              <p className="text-gray-400">Comprehensive analysis with shareable results and threat insights for better security decisions.</p>
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
        <ClientAnimatedButton 
          href="/scan" 
          variant="secondary" 
          size="lg"
          className="bg-secondary text-primary shadow-neon"
        >
          Try It Now
        </ClientAnimatedButton>
      </ClientParallaxSection>
      
      {/* Stats Section */}
      <MotionDiv 
        className="py-20 bg-primary text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Background grid */}
        <div className="absolute inset-0 bg-cyber-grid bg-[length:20px_20px] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <MotionP
              className="text-secondary font-mono mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              PERFORMANCE METRICS
            </MotionP>
            
            <MotionH1
              className="text-3xl md:text-4xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="text-white">Why </span>
              <span className="text-secondary">Choose </span>
              <span className="text-white">VirusAI</span>
            </MotionH1>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <MotionDiv
              className="p-6 bg-primary-light/30 rounded-xl backdrop-blur-sm border border-gray-800"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-secondary mb-2 flex justify-center">
                99.8<span className="text-2xl text-secondary-light self-start mt-1">%</span>
              </div>
              <div className="text-gray-400">Detection Rate</div>
            </MotionDiv>
            
            <MotionDiv
              className="p-6 bg-primary-light/30 rounded-xl backdrop-blur-sm border border-gray-800"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-secondary mb-2">1GB</div>
              <div className="text-gray-400">Max File Size</div>
            </MotionDiv>
            
            <MotionDiv
              className="p-6 bg-primary-light/30 rounded-xl backdrop-blur-sm border border-gray-800"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-secondary mb-2">24/7</div>
              <div className="text-gray-400">Cloud Scanning</div>
            </MotionDiv>
            
            <MotionDiv
              className="p-6 bg-primary-light/30 rounded-xl backdrop-blur-sm border border-gray-800"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-secondary mb-2">∞</div>
              <div className="text-gray-400">Free Scans</div>
            </MotionDiv>
          </div>
          
          <MotionDiv
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <ClientAnimatedButton 
              href="/scan" 
              variant="primary" 
              size="lg"
              className="bg-accent hover:bg-accent-light text-white shadow-neon-accent hover:shadow-neon-accent-hover"
            >
              Start Protecting Your Files
            </ClientAnimatedButton>
          </MotionDiv>
        </div>
      </MotionDiv>
      
      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-b from-primary-dark to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <MotionH1
            className="text-4xl md:text-5xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="text-white">Ready to </span>
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">secure your files</span>
            <span className="text-white">?</span>
          </MotionH1>
          
          <MotionP
            className="text-xl text-gray-300 mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Experience cutting-edge virus detection with AI-powered analysis.
            Start scanning for free today.
          </MotionP>
          
          <MotionDiv
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <ClientAnimatedButton 
              href="/scan" 
              variant="primary" 
              size="lg"
              className="bg-secondary hover:bg-secondary-light text-primary w-full sm:w-auto shadow-neon hover:shadow-neon-hover"
            >
              Start Free Scan
            </ClientAnimatedButton>
            
            <ClientAnimatedButton 
              href="/dashboard" 
              variant="outline" 
              size="lg"
              className="border-secondary text-secondary hover:bg-secondary/10 w-full sm:w-auto"
            >
              View Dashboard
            </ClientAnimatedButton>
          </MotionDiv>
        </div>
      </div>
    </>
  );
};

export default ClientHome; 