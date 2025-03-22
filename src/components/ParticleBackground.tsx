'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ParticleBackgroundProps {
  count?: number;
  color?: string;
}

const ParticleBackground = ({ count = 1000, color = '#1A237E' }: ParticleBackgroundProps) => {
  const mesh = useRef<THREE.Points>(null!);
  
  // Create particles
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      temp[i3] = (Math.random() - 0.5) * 30;  // x
      temp[i3 + 1] = (Math.random() - 0.5) * 30;  // y
      temp[i3 + 2] = (Math.random() - 0.5) * 30;  // z
    }
    return temp;
  }, [count]);

  // Create particle sizes
  const sizes = useMemo(() => {
    const temp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      temp[i] = Math.random() * 0.5 + 0.3;
    }
    return temp;
  }, [count]);
  
  useFrame((state, delta) => {
    if (mesh.current) {
      // Rotate particles
      mesh.current.rotation.x += delta * 0.01;
      mesh.current.rotation.y += delta * 0.01;
      
      // Update positions (simulate movement)
      const positions = mesh.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime * 0.1 + i) * 0.01;
      }
      mesh.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        sizeAttenuation={true}
        color={color}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleBackground; 