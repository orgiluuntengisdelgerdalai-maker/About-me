import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  twinkleSpeed: number;
  alpha: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

interface NebulaParticle {
  angle: number;
  distance: number;
  speed: number;
  size: number;
  color: string;
  alpha: number;
}

export const AnimatedGalaxyCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 1. Generate 3D Starfield
    const STAR_COUNT = 320;
    const stars: Star[] = [];
    const starColors = [
      '#ffffff',
      '#e0f2fe',
      '#38bdf8',
      '#818cf8',
      '#fef08a',
      '#f59e0b',
      '#ec4899',
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        size: Math.random() * 1.5 + 0.5,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        alpha: Math.random(),
      });
    }

    // 2. Galaxy Spiral Arms Particles (Deep ambient swirl)
    const SPIRAL_PARTICLES_COUNT = 180;
    const spiralParticles: NebulaParticle[] = [];
    const nebulaColors = [
      'rgba(245, 158, 11, ', // Golden orange
      'rgba(249, 115, 22, ', // Deep amber
      'rgba(14, 165, 233, ', // Cyan / Sky blue
      'rgba(99, 102, 241, ', // Indigo
      'rgba(236, 72, 153, ', // Pink nebula
    ];

    for (let i = 0; i < SPIRAL_PARTICLES_COUNT; i++) {
      const armOffset = (i % 2) * Math.PI; // 2 spiral arms
      const dist = Math.random() * (Math.min(width, height) * 0.45);
      const angle = (dist / 120) * 1.5 + armOffset + (Math.random() - 0.5) * 0.4;
      spiralParticles.push({
        angle,
        distance: dist,
        speed: (0.0012 + (1 / (dist + 50)) * 0.1) * (Math.random() * 0.4 + 0.8),
        size: Math.random() * 80 + 30,
        color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
        alpha: Math.random() * 0.18 + 0.05,
      });
    }

    // 3. Shooting Stars (Meteors)
    const shootingStars: ShootingStar[] = [];
    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width * 0.8 + width * 0.1,
        y: Math.random() * height * 0.4,
        length: Math.random() * 80 + 60,
        speed: Math.random() * 10 + 12,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2, // ~45 deg diagonal
        opacity: 1,
        active: true,
      });
    };

    let shootingStarTimer = 0;

    // Track mouse for gentle parallax
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Render loop
    let tick = 0;
    const render = () => {
      tick++;
      // Smooth mouse easing
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;
      const offsetX = (mouseX - width / 2) * 0.03;
      const offsetY = (mouseY - height / 2) * 0.03;

      // Clear with dark cosmic fade
      ctx.fillStyle = '#030306';
      ctx.fillRect(0, 0, width, height);

      // A. Draw Central Galaxy Core Glow
      const centerX = width / 2 + offsetX;
      const centerY = height / 2 + offsetY;

      // Deep radial glow
      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        Math.min(width, height) * 0.55
      );
      coreGradient.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
      coreGradient.addColorStop(0.3, 'rgba(14, 165, 233, 0.05)');
      coreGradient.addColorStop(0.7, 'rgba(99, 102, 241, 0.03)');
      coreGradient.addColorStop(1, 'rgba(3, 3, 6, 0)');

      ctx.fillStyle = coreGradient;
      ctx.fillRect(0, 0, width, height);

      // B. Draw Spiral Nebula Clouds
      spiralParticles.forEach((p) => {
        p.angle += p.speed;
        const x = centerX + Math.cos(p.angle) * p.distance;
        const y = centerY + Math.sin(p.angle) * p.distance * 0.65; // slight tilt for 3D galaxy disc

        const grad = ctx.createRadialGradient(x, y, 0, x, y, p.size);
        const pulseAlpha = p.alpha * (0.8 + Math.sin(tick * 0.02 + p.distance) * 0.2);
        grad.addColorStop(0, `${p.color}${pulseAlpha})`);
        grad.addColorStop(1, `${p.color}0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // C. Draw 3D Flying Stars with Depth & Twinkle
      stars.forEach((star) => {
        // Move star forward slowly
        star.z -= 0.6;
        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        // Perspective projection
        const k = 280 / star.z;
        const sx = star.x * k + centerX;
        const sy = star.y * k + centerY;

        if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
          star.alpha += star.twinkleSpeed;
          const currentAlpha = 0.35 + Math.abs(Math.sin(star.alpha)) * 0.65;
          const radius = star.size * Math.min(k * 1.2, 3);

          ctx.fillStyle = star.color;
          ctx.globalAlpha = Math.min(currentAlpha, 1);

          ctx.beginPath();
          ctx.arc(sx, sy, radius, 0, Math.PI * 2);
          ctx.fill();

          // Subtle glow for larger stars
          if (radius > 1.4) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = star.color;
            ctx.beginPath();
            ctx.arc(sx, sy, radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });
      ctx.globalAlpha = 1;

      // D. Spawn & Render Shooting Stars
      shootingStarTimer++;
      if (shootingStarTimer % 190 === 0 && Math.random() > 0.3) {
        spawnShootingStar();
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        if (!s.active) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.7, `rgba(56, 189, 248, ${s.opacity * 0.6})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${s.opacity})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.015;

        if (s.opacity <= 0 || s.x > width + 100 || s.y > height + 100) {
          s.active = false;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
};
