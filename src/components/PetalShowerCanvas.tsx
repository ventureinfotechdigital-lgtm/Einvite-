import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  color: string;
  opacity: number;
}

interface PetalShowerCanvasProps {
  burstTrigger?: number;
  petalColors?: string[];
}

export const PetalShowerCanvas: React.FC<PetalShowerCanvasProps> = ({
  burstTrigger = 0,
  petalColors,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  const colors = petalColors && petalColors.length > 0 ? petalColors : [
    '#E11D48', // Rose crimson
    '#FB7185', // Rose petal pink
    '#F59E0B', // Marigold gold
    '#EA580C', // Marigold orange
    '#FEF08A', // Pale marigold yellow
    '#BE123C', // Deep velvet red
  ];

  const createPetal = (isBurst = false, width: number, height: number): Petal => {
    return {
      x: isBurst ? width * 0.5 + (Math.random() - 0.5) * (width * 0.8) : Math.random() * width,
      y: isBurst ? Math.random() * (height * 0.3) : -20 - Math.random() * 50,
      size: 8 + Math.random() * 12,
      speedY: isBurst ? 2 + Math.random() * 4 : 1.2 + Math.random() * 2.2,
      speedX: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 3,
      flip: Math.random() * Math.PI,
      flipSpeed: 0.03 + Math.random() * 0.05,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.75 + Math.random() * 0.25,
    };
  };

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

    // Initial ambient petals
    const count = 35;
    petalsRef.current = Array.from({ length: count }, () => {
      const p = createPetal(false, width, height);
      p.y = Math.random() * height; // Spread across screen initially
      return p;
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const petals = petalsRef.current;
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.015) * 1.5 + p.speedX;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;

        if (p.y > height + 30) {
          // Recycle petal to top
          Object.assign(p, createPetal(false, width, height));
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.scale(Math.cos(p.flip), 1);

        ctx.beginPath();
        // Delicate curved flower petal shape
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.6, p.size * 0.8, p.size * 0.6, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.6, -p.size * 0.8, -p.size * 0.6, 0, -p.size);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Subtle petal vein highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.7);
        ctx.lineTo(0, p.size * 0.7);
        ctx.stroke();

        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Burst effect when burstTrigger changes
  useEffect(() => {
    if (burstTrigger > 0 && canvasRef.current) {
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      // Add 60 sudden celebration petals
      for (let i = 0; i < 60; i++) {
        petalsRef.current.push(createPetal(true, width, height));
      }
    }
  }, [burstTrigger]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-30 w-full h-full"
      style={{ mixBlendMode: 'normal' }}
    />
  );
};
