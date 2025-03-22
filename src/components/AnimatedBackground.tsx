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
    }[] = [];
    
    const createParticle = () => {
      const radius = Math.random() * 10 + 1;
      const x = Math.random() * (canvas.width - radius * 2) + radius;
      const y = Math.random() * (canvas.height - radius * 2) + radius;
      
      const colors = ['#1A237E', '#00BFA5', '#F44336'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const vx = (Math.random() - 0.5) * 0.5;
      const vy = (Math.random() - 0.5) * 0.5;
      
      // Create GSAP timeline for the particle
      const timeline = gsap.timeline({ repeat: -1 });
      const alpha = Math.random() * 0.5 + 0.1;
      
      timeline.to({ value: 0 }, {
        value: 1,
        duration: Math.random() * 5 + 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        onUpdate: function(this: any) {
          // This will be used to modulate the particle's properties
        }
      });
      
      particles.push({ x, y, radius, color, vx, vy, alpha, timeline });
    };
    
    // Create initial particles
    for (let i = 0; i < 50; i++) {
      createParticle();
    }
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
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
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();
        
        // Draw connections
        particles.forEach(other => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = 0.1 * (1 - distance / 150);
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
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-40"
    />
  );
};

export default AnimatedBackground; 