import React, { useEffect, useRef } from 'react';

export const GoldenSparklesOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    interface Sparkle {
      x: number;
      y: number;
      size: number;
      alpha: number;
      speedAlpha: number;
      speedY: number;
      speedX: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
    }

    const goldColors = ['#FFE87C', '#FFD700', '#FFF8DC', '#FFA500', '#FFFFFF'];

    const sparkles: Sparkle[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 2 + Math.random() * 5,
      alpha: Math.random(),
      speedAlpha: 0.015 + Math.random() * 0.03,
      speedY: -(0.3 + Math.random() * 0.8),
      speedX: (Math.random() - 0.5) * 0.5,
      color: goldColors[Math.floor(Math.random() * goldColors.length)],
      rotation: Math.random() * Math.PI,
      rotationSpeed: 0.02 + Math.random() * 0.04,
    }));

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      sparkles.forEach((s) => {
        s.y += s.speedY;
        s.x += s.speedX;
        s.alpha += s.speedAlpha;
        s.rotation += s.rotationSpeed;

        if (s.alpha > 1 || s.alpha < 0.1) {
          s.speedAlpha = -s.speedAlpha;
        }

        if (s.y < -20) {
          s.y = height + 20;
          s.x = Math.random() * width;
        }

        const currentAlpha = Math.max(0, Math.min(1, s.alpha));

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.globalAlpha = currentAlpha;

        // Draw 4-point shining diamond sparkle
        ctx.fillStyle = s.color;
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10;

        ctx.beginPath();
        const r = s.size;
        ctx.moveTo(0, -r * 2);
        ctx.quadraticCurveTo(0, 0, r * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, r * 2);
        ctx.quadraticCurveTo(0, 0, -r * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r * 2);
        ctx.fill();

        // Central bright core
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-35 w-full h-full"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
