'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Import Three.js components with dynamic import in a client component
const HeroScene = dynamic(() => import('@/components/HeroScene'), { ssr: false });

const ClientHeroSection = () => {
  return (
    <motion.div 
      className="md:w-1/2 mt-12 md:mt-0"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <HeroScene />
    </motion.div>
  );
};

export default ClientHeroSection; 