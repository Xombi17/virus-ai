'use client';

import { Canvas } from '@react-three/fiber';
import ParticleBackground from '@/components/ParticleBackground';

const ThreeCanvas = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <ParticleBackground count={500} color="#00BFA5" />
    </Canvas>
  );
};

export default ThreeCanvas; 