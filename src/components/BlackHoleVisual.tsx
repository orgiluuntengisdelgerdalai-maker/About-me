import React, { useEffect, useRef } from 'react';

interface BlackHoleVisualProps {
  zoomLevel?: number;
}

export const BlackHoleVisual: React.FC<BlackHoleVisualProps> = ({ zoomLevel = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const size = 520;
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;

    // Accretion disk particles
    const PARTICLE_COUNT = 380;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const dist = Math.random() * 150 + 60; // distance from center (outside event horizon)
      return {
        dist,
        baseDist: dist,
        angle: Math.random() * Math.PI * 2,
        speed: (0.015 + (1 / dist) * 2.2) * (Math.random() * 0.3 + 0.85),
        radius: Math.random() * 2 + 0.8,
        colorType: Math.random(),
        opacity: Math.random() * 0.7 + 0.3,
      };
    });

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, size, size);

      // 1. Deep Relativistic Gravitational Lensing Halo (Back glow)
      const outerHalo = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, 230);
      outerHalo.addColorStop(0, 'rgba(249, 115, 22, 0.45)');
      outerHalo.addColorStop(0.3, 'rgba(245, 158, 11, 0.25)');
      outerHalo.addColorStop(0.6, 'rgba(56, 189, 248, 0.15)');
      outerHalo.addColorStop(0.85, 'rgba(147, 51, 234, 0.08)');
      outerHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = outerHalo;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 230, 0, Math.PI * 2);
      ctx.fill();

      // 2. Gravitational Lensing Top Arc (Interstellar Black Hole warp)
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Upper gravitational warp
      const upperGrad = ctx.createLinearGradient(-160, -70, 160, -130);
      upperGrad.addColorStop(0, 'rgba(251, 146, 60, 0.2)');
      upperGrad.addColorStop(0.5, 'rgba(254, 215, 170, 0.85)');
      upperGrad.addColorStop(1, 'rgba(56, 189, 248, 0.2)');

      ctx.strokeStyle = upperGrad;
      ctx.lineWidth = 14;
      ctx.shadowBlur = 24;
      ctx.shadowColor = '#f97316';
      ctx.beginPath();
      ctx.ellipse(0, -20, 145, 95, 0, Math.PI, 0, false);
      ctx.stroke();

      // Lower gravitational warp (mirrored fainter)
      const lowerGrad = ctx.createLinearGradient(-150, 70, 150, 130);
      lowerGrad.addColorStop(0, 'rgba(251, 146, 60, 0.1)');
      lowerGrad.addColorStop(0.5, 'rgba(254, 215, 170, 0.6)');
      lowerGrad.addColorStop(1, 'rgba(56, 189, 248, 0.1)');

      ctx.strokeStyle = lowerGrad;
      ctx.lineWidth = 10;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.ellipse(0, 20, 145, 90, 0, 0, Math.PI, false);
      ctx.stroke();
      ctx.restore();

      // 3. Spinning Accretion Disk Particles
      ctx.save();
      ctx.translate(centerX, centerY);

      particles.forEach((p) => {
        p.angle += p.speed;
        
        // Tilt disk for 3D accretion perspective
        const x = Math.cos(p.angle) * p.dist;
        const y = Math.sin(p.angle) * (p.dist * 0.38);

        // Doppler beaming: particles moving toward observer (left side) are brighter and bluer
        const isApproaching = Math.sin(p.angle) < 0;
        let color = '#fed7aa'; // fiery warm
        if (p.colorType > 0.6) {
          color = isApproaching ? '#7dd3fc' : '#fb923c';
        } else if (p.colorType > 0.3) {
          color = '#fbbf24';
        } else {
          color = '#ffffff';
        }

        const alpha = isApproaching ? Math.min(p.opacity * 1.3, 1) : p.opacity * 0.55;

        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
      ctx.globalAlpha = 1;

      // 4. Photon Ring (Blinding narrow golden border of event horizon)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.shadowBlur = 28;
      ctx.shadowColor = '#fdba74';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, 56, 0, Math.PI * 2);
      ctx.stroke();

      // Secondary glowing thin photon orbit
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.9)';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 5. THE EVENT HORIZON & SINGULARITY (Pure Infinite Black Shadow in the middle)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.fillStyle = '#000000';
      ctx.shadowBlur = 35;
      ctx.shadowColor = '#000000';
      ctx.beginPath();
      ctx.arc(0, 0, 54, 0, Math.PI * 2);
      ctx.fill();

      // Sharp shadow edge
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(0, 0, 54, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className="relative flex items-center justify-center pointer-events-none transition-transform duration-700 ease-out"
      style={{ transform: `scale(${zoomLevel})` }}
    >
      {/* Outer ambient gravitational distortion rings */}
      <div className="absolute w-[440px] h-[440px] md:w-[600px] md:h-[600px] rounded-full border border-orange-500/20 animate-galaxy-spin pointer-events-none"></div>
      <div className="absolute w-[500px] h-[500px] md:w-[680px] md:h-[680px] rounded-full border border-dashed border-cyan-400/20 animate-reverse-spin pointer-events-none"></div>

      {/* Relativistic Jet Stream (Vertical light beams shooting from poles) */}
      <div className="absolute w-1.5 h-[520px] bg-gradient-to-b from-transparent via-cyan-400/70 to-transparent blur-sm pointer-events-none animate-pulse"></div>
      <div className="absolute w-0.5 h-[480px] bg-gradient-to-b from-transparent via-white to-transparent pointer-events-none"></div>

      {/* Interactive Canvas Rendering the Black Hole Simulation */}
      <canvas
        ref={canvasRef}
        className="w-[320px] h-[320px] md:w-[500px] md:h-[500px] drop-shadow-[0_0_60px_rgba(249,115,22,0.5)]"
      />
    </div>
  );
};
