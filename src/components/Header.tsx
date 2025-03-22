'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const Header = () => {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check system preference on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  return (
    <header className="bg-primary text-white w-full py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center">
          <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
            <span className="text-primary text-lg font-bold">V</span>
          </div>
          <span className="text-secondary mr-1">Virus</span>AI
        </Link>
        <div className="flex items-center">
          <nav className="flex space-x-6 mr-6">
            <Link 
              href="/" 
              className={`hover:text-secondary transition-colors ${
                pathname === '/' ? 'text-secondary font-medium border-b-2 border-secondary' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              href="/dashboard" 
              className={`hover:text-secondary transition-colors ${
                pathname === '/dashboard' ? 'text-secondary font-medium border-b-2 border-secondary' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/scan" 
              className={`hover:text-secondary transition-colors ${
                pathname === '/scan' ? 'text-secondary font-medium border-b-2 border-secondary' : ''
              }`}
            >
              Scan
            </Link>
          </nav>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-primary-dark transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 