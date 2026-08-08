import React, { useEffect, useRef } from 'react';
import { AIState } from '../../ai/ui-contracts';

interface AiOsParticleCanvasProps {
  aiState?: AIState;
  interactive?: boolean;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulseOffset: number;
}

export const AiOsParticleCanvas: React.FC<AiOsParticleCanvasProps> = ({
  aiState = 'IDLE',
  interactive = true,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = (canvas.width = canvas.parentElement?.clientWidth || canvas.width);
    let height = (canvas.height = canvas.parentElement?.clientHeight || canvas.height);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(20, 184, 166, ',   // Teal
      'rgba(245, 158, 11, ',   // Amber
      'rgba(59, 130, 246, ',   // Blue
      'rgba(168, 85, 247, ',   // Purple
      'rgba(16, 185, 129, '    // Emerald
    ];

    const initParticles = () => {
      const count = Math.min(Math.floor((width * height) / 10000), 75);
      particles = [];

      for (let i = 0; i < count; i++) {
        const baseColor = colors[Math.floor(Math.random() * colors.length)];
        const alpha = Math.random() * 0.6 + 0.3;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 2.5 + 1.2,
          color: baseColor,
          alpha,
          baseAlpha: alpha,
          pulseSpeed: Math.random() * 0.03 + 0.01,
          pulseOffset: Math.random() * Math.PI * 2
        });
      }
    };

    initParticles();

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const parentElem = canvas.parentElement;
    if (parentElem && interactive) {
      parentElem.addEventListener('mousemove', handleMouseMove);
      parentElem.addEventListener('mouseleave', handleMouseLeave);
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Determine speed multiplier based on AI state
      let speedMult = 1;
      let lineDistThreshold = 110;
      if (aiState === 'UNDERSTANDING' || aiState === 'PLANNING' || aiState === 'RETRIEVING') {
        speedMult = 2.2;
        lineDistThreshold = 140;
      } else if (aiState === 'EXECUTING') {
        speedMult = 3.5;
        lineDistThreshold = 160;
      } else if (aiState === 'WAITING_FOR_CONFIRMATION') {
        speedMult = 1.2;
        lineDistThreshold = 130;
      }

      // Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Pulsing alpha
        p.alpha = p.baseAlpha + Math.sin(time * p.pulseSpeed * 10 + p.pulseOffset) * 0.25;

        // Move particle
        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult;

        // Bounce from walls
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        // Mouse influence (attract / repulse)
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const angle = Math.atan2(dy, dx);
            const force = (120 - dist) / 120;
            p.x -= Math.cos(angle) * force * 2;
            p.y -= Math.sin(angle) * force * 2;
          }
        }

        // Render Particle Glowing Node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, Math.min(1, p.alpha))})`;
        ctx.fill();

        // Glow aura
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, Math.min(1, p.alpha * 0.3))})`;
        ctx.fill();

        // Connect nearby particles (Neural Web Lines)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < lineDistThreshold) {
            const lineAlpha = (1 - dist / lineDistThreshold) * 0.35 * Math.min(p.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(20, 184, 166, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (parentElem && interactive) {
        parentElem.removeEventListener('mousemove', handleMouseMove);
        parentElem.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [aiState, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none rounded-3xl ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
