'use client';

import dynamic from 'next/dynamic';

// Import Three.js components with dynamic import in a client component
const ThreeCanvas = dynamic(
  () => import('@/components/ThreeCanvas'), 
  { ssr: false }
);

const ClientThreeCanvas = () => {
  return (
    <div className="absolute inset-0 z-[-1] opacity-20 overflow-hidden">
      <ThreeCanvas />
    </div>
  );
};

export default ClientThreeCanvas; 