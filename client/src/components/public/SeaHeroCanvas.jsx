import { useEffect, useRef } from 'react';

function drawFish(ctx, x, y, size, color, flip = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flip, 1);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 1.15, size * 0.48, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-size * 1.05, 0);
  ctx.lineTo(-size * 1.65, -size * 0.55);
  ctx.lineTo(-size * 1.65, size * 0.55);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath();
  ctx.arc(size * 0.72, -size * 0.12, Math.max(size * 0.08, 1.5), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export default function SeaHeroCanvas() {
  const canvasRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let raf = 0;
    let width = 0;
    let height = 0;
    const fish = Array.from({ length: 24 }, (_, index) => ({
      x: Math.random(),
      y: 0.24 + Math.random() * 0.62,
      speed: 0.00045 + Math.random() * 0.0011,
      size: 7 + Math.random() * 18,
      depth: 0.45 + Math.random() * 0.85,
      hue: index % 3,
    }));
    const bubbles = Array.from({ length: 42 }, () => ({
      x: Math.random(),
      y: Math.random(),
      speed: 0.0008 + Math.random() * 0.0015,
      size: 1.5 + Math.random() * 4,
    }));

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function drawWave(y, amp, speed, color, fillToBottom = true) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= width + 8; x += 8) {
        const phase = x * 0.012 + frame * speed;
        ctx.lineTo(x, y + Math.sin(phase) * amp + Math.sin(phase * 0.42) * amp * 0.65);
      }
      if (fillToBottom) {
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    function drawBoat() {
      const px = pointer.current.x * 20;
      const boatX = width * 0.74 + Math.sin(frame * 0.012) * 12 + px;
      const boatY = height * 0.2 + Math.sin(frame * 0.018) * 3;
      ctx.save();
      ctx.translate(boatX, boatY);
      ctx.fillStyle = 'rgba(0,23,39,0.72)';
      ctx.beginPath();
      ctx.moveTo(-64, 8);
      ctx.lineTo(58, 8);
      ctx.lineTo(34, 28);
      ctx.lineTo(-46, 28);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-4, 8);
      ctx.lineTo(-4, -58);
      ctx.lineTo(46, 2);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.76)';
      ctx.beginPath();
      ctx.moveTo(1, -52);
      ctx.lineTo(43, 0);
      ctx.lineTo(1, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function render() {
      frame += 1;
      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, '#dff8ff');
      sky.addColorStop(0.28, '#7bcbe8');
      sky.addColorStop(0.54, '#0077c8');
      sky.addColorStop(1, '#001727');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      for (let i = 0; i < 8; i += 1) {
        const rayX = width * (0.1 + i * 0.12) + pointer.current.x * 26;
        ctx.beginPath();
        ctx.moveTo(rayX, 0);
        ctx.lineTo(rayX + 70, height);
        ctx.lineTo(rayX + 140, height);
        ctx.lineTo(rayX + 26, 0);
        ctx.closePath();
        ctx.fill();
      }

      drawBoat();
      drawWave(height * 0.32, 14, 0.035, 'rgba(255,255,255,0.28)', false);
      drawWave(height * 0.38, 20, 0.028, 'rgba(0,169,157,0.32)');
      drawWave(height * 0.48, 22, 0.022, 'rgba(0,119,200,0.55)');
      drawWave(height * 0.62, 28, 0.017, 'rgba(0,59,92,0.68)');

      bubbles.forEach((bubble) => {
        bubble.y -= bubble.speed;
        if (bubble.y < -0.04) {
          bubble.y = 1.04;
          bubble.x = Math.random();
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.46)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(bubble.x * width + pointer.current.x * 8, bubble.y * height, bubble.size, 0, Math.PI * 2);
        ctx.stroke();
      });

      fish.forEach((item) => {
        item.x += item.speed * item.depth;
        if (item.x > 1.12) item.x = -0.12;
        const color = ['rgba(255,255,255,0.62)', 'rgba(134,237,232,0.76)', 'rgba(23,159,218,0.74)'][item.hue];
        drawFish(
          ctx,
          item.x * width + pointer.current.x * 38 * item.depth,
          item.y * height + Math.sin(frame * 0.025 + item.x * 12) * 7,
          item.size,
          color,
          1,
        );
      });

      raf = window.requestAnimationFrame(render);
    }

    function onPointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      pointer.current = {
        x: (event.clientX - rect.left) / rect.width - 0.5,
        y: (event.clientY - rect.top) / rect.height - 0.5,
      };
    }

    resize();
    render();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
