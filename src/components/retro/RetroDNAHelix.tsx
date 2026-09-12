import React, { useEffect, useRef } from 'react';

interface RetroDNAHelixProps {
  width?: number;
  height?: number;
  speed?: number;
  className?: string;
}

export const RetroDNAHelix: React.FC<RetroDNAHelixProps> = ({
  width = 64,
  height = 140,
  speed = 0.04,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Keep image rendering pixelated
    ctx.imageSmoothingEnabled = false;

    let animFrameId: number;
    let angle = 0;

    const rungsCount = 14;
    const pixelSize = 4;
    const amplitude = (width - 16) / 2;
    const centerX = width / 2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw pixelated DNA rungs
      for (let i = 0; i < rungsCount; i++) {
        const y = 8 + (i * (height - 16)) / (rungsCount - 1);
        const theta = angle + i * 0.45;

        const xOffset = Math.sin(theta) * amplitude;
        const depth = Math.cos(theta); // -1 (back) to +1 (front)

        const x1 = Math.round((centerX - xOffset) / pixelSize) * pixelSize;
        const x2 = Math.round((centerX + xOffset) / pixelSize) * pixelSize;
        const ySnap = Math.round(y / pixelSize) * pixelSize;

        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);

        // Connecting horizontal base pair rungs (pixel dither)
        const alpha = depth > 0 ? 0.8 : 0.3;
        ctx.fillStyle = `rgba(107, 255, 158, ${alpha})`;
        for (let rx = minX + pixelSize; rx < maxX; rx += pixelSize * 2) {
          ctx.fillRect(rx, ySnap, pixelSize, pixelSize);
        }

        // Left strand node (Cyan)
        const leftFront = Math.sin(theta + Math.PI / 2) > 0;
        ctx.fillStyle = leftFront ? '#4fe3ff' : '#1e6878';
        ctx.fillRect(x1 - pixelSize, ySnap - pixelSize / 2, pixelSize * 2, pixelSize * 2);

        // Right strand node (Magenta)
        const rightFront = !leftFront;
        ctx.fillStyle = rightFront ? '#ff4fd8' : '#7d1e66';
        ctx.fillRect(x2 - pixelSize, ySnap - pixelSize / 2, pixelSize * 2, pixelSize * 2);
      }

      angle += speed;
      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [width, height, speed]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`image-rendering-pixelated ${className}`}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden="true"
    />
  );
};

export default RetroDNAHelix;
