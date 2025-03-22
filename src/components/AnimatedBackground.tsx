'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', setCanvasSize);
    setCanvasSize();
    
    // Create particles
    const particles: {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      alpha: number;
      timeline: gsap.core.Timeline;
      type: 'dot' | 'square' | 'triangle';
      pulse: boolean;
    }[] = [];
    
    const createParticle = () => {
      const radius = Math.random() * 5 + 1;
      const x = Math.random() * (canvas.width - radius * 2) + radius;
      const y = Math.random() * (canvas.height - radius * 2) + radius;
      
      // Use new color scheme
      const colors = ['#00E5FF', '#FF0055', '#FF7B00'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const vx = (Math.random() - 0.5) * 0.3;
      const vy = (Math.random() - 0.5) * 0.3;
      
      // Create GSAP timeline for the particle
      const timeline = gsap.timeline({ repeat: -1 });
      const alpha = Math.random() * 0.4 + 0.1;
      
      // Randomly choose particle type
      const types: ('dot' | 'square' | 'triangle')[] = ['dot', 'square', 'triangle'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      // Decide if particle will have pulse effect
      const pulse = Math.random() > 0.7;
      
      timeline.to({ value: 0 }, {
        value: 1,
        duration: Math.random() * 5 + 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      
      particles.push({ x, y, radius, color, vx, vy, alpha, timeline, type, pulse });
    };
    
    // Create digital circuit grid
    const drawGrid = () => {
      const gridSize = 80;
      ctx.strokeStyle = '#0A1128';
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = 1;
      
      // Draw vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Draw horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };
    
    // Create initial particles
    for (let i = 0; i < 60; i++) {
      createParticle();
    }
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw digital grid
      drawGrid();
      
      // Draw and update particles
      particles.forEach(particle => {
        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x <= particle.radius || particle.x >= canvas.width - particle.radius) {
          particle.vx *= -1;
        }
        
        if (particle.y <= particle.radius || particle.y >= canvas.height - particle.radius) {
          particle.vy *= -1;
        }
        
        // Set alpha with pulsing effect for some particles
        let currentAlpha = particle.alpha;
        if (particle.pulse) {
          currentAlpha = particle.alpha * (0.5 + 0.5 * Math.sin(Date.now() * 0.001));
        }
        ctx.globalAlpha = currentAlpha;
        
        // Draw particle based on type
        ctx.fillStyle = particle.color;
        
        if (particle.type === 'dot') {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.type === 'square') {
          ctx.fillRect(
            particle.x - particle.radius, 
            particle.y - particle.radius, 
            particle.radius * 2, 
            particle.radius * 2
          );
        } else if (particle.type === 'triangle') {
          const height = particle.radius * 1.732; // Height of equilateral triangle
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y - particle.radius);
          ctx.lineTo(particle.x + particle.radius, particle.y + height/2);
          ctx.lineTo(particle.x - particle.radius, particle.y + height/2);
          ctx.closePath();
          ctx.fill();
        }
        
        // Draw connections with a cybersecurity network effect
        particles.forEach(other => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 180 && distance > 0) {
            // Create data packet effect
            if (Math.random() > 0.995) {
              // Draw a small data packet traveling along the connection
              const packetPos = Math.random(); // Position along the line
              const packetX = particle.x - dx * packetPos;
              const packetY = particle.y - dy * packetPos;
              
              ctx.fillStyle = '#FFFFFF';
              ctx.globalAlpha = 0.7;
              ctx.beginPath();
              ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
              ctx.fill();
            }
            
            // Draw connection line
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = particle.color;
            
            // Create a more gradient-like effect for lines
            const gradient = ctx.createLinearGradient(
              particle.x, particle.y, other.x, other.y
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, other.color);
            
            ctx.strokeStyle = gradient;
            ctx.globalAlpha = 0.15 * (1 - distance / 180);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      particles.forEach(particle => {
        particle.timeline.kill();
      });
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-b from-primary-dark to-primary"
    />
  );
};

export default AnimatedBackground; 