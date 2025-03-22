'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

interface AnimatedButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AnimatedButton = ({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: AnimatedButtonProps) => {
  const baseClasses = 'relative overflow-hidden rounded-full font-bold inline-flex items-center justify-center transition-all';
  
  const sizeClasses = {
    sm: 'text-sm py-2 px-4',
    md: 'text-base py-3 px-6',
    lg: 'text-lg py-4 px-8',
  };
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10',
  };
  
  return (
    <Link href={href} className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      <motion.span
        className="relative z-10 flex items-center gap-2"
        initial={{ y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      
      <motion.span
        className="absolute inset-0 bg-white dark:bg-gray-800 mix-blend-difference"
        initial={{ scale: 0, opacity: 0, x: '100%' }}
        whileHover={{ scale: 1.5, opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      />
      
      <motion.span
        className="absolute bottom-0 left-0 h-[2px] bg-current"
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
    </Link>
  );
};

export default AnimatedButton; 