'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

interface VirusParticleProps {
  position: [number, number, number];
  size: number;
  color: string;
  speed: number;
}

// Virus particle component
const VirusParticle = ({ position, size, color, speed }: VirusParticleProps) => {
  const ref = useRef<THREE.Mesh>(null!);
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * speed * 0.5;
      ref.current.rotation.y += delta * speed * 0.7;
      ref.current.rotation.z += delta * speed * 0.3;
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere 
          ref={ref} 
          args={[size, 16, 16]} 
          position={[0, 0, 0]}
        >
          <meshStandardMaterial 
            color={color} 
            roughness={0.3} 
            metalness={0.8} 
            emissive={color}
            emissiveIntensity={0.2}
          />
        </Sphere>
        
        {/* Virus spikes */}
        {Array.from({ length: 10 }).map((_, i) => {
          const theta = (i / 10) * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const x = size * 1.2 * Math.sin(phi) * Math.cos(theta);
          const y = size * 1.2 * Math.sin(phi) * Math.sin(theta);
          const z = size * 1.2 * Math.cos(phi);
          
          return (
            <Box 
              key={i} 
              args={[size * 0.2, size * 0.2, size * 0.7]} 
              position={[x, y, z]}
              rotation={[0, 0, Math.atan2(y, x)]}
            >
              <meshStandardMaterial 
                color={color} 
                roughness={0.3} 
                metalness={0.5} 
              />
            </Box>
          );
        })}
      </Float>
    </group>
  );
};

interface ShieldProps {
  position: [number, number, number];
  size: number;
  speed: number;
}

// Shield component
const Shield = ({ position, size, speed }: ShieldProps) => {
  const ref = useRef<THREE.Group>(null!);
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed;
    }
  });

  return (
    <group position={position} ref={ref}>
      <Sphere args={[size, 32, 32]}>
        <meshStandardMaterial 
          color="#00BFA5" 
          transparent={true}
          opacity={0.3}
          roughness={0.1}
          metalness={0.9}
        />
      </Sphere>
    </group>
  );
};

// Main scene component
const HeroScene = () => {
  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00BFA5" />
        
        <Shield position={[0, 0, 0]} size={3.5} speed={0.1} />
        
        <VirusParticle position={[-3, 2, 0]} size={0.7} color="#F44336" speed={1} />
        <VirusParticle position={[3, -1, 2]} size={0.5} color="#F44336" speed={1.5} />
        <VirusParticle position={[2, 2, -1]} size={0.6} color="#F44336" speed={0.8} />
        <VirusParticle position={[-2, -2, 1]} size={0.4} color="#F44336" speed={1.2} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default HeroScene; 