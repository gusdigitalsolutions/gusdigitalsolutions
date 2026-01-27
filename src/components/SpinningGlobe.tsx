import { useEffect, useRef } from 'react';

export default function SpinningGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const size = Math.min(canvas.parentElement?.clientWidth || 300, 400);
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35;
    let rotation = 0;
    let mouseX = 0;
    let mouseY = 0;

    // Track mouse for interactivity
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Connection points on globe
    const points: { lat: number; lng: number }[] = [];
    for (let i = 0; i < 40; i++) {
      points.push({
        lat: Math.random() * Math.PI - Math.PI / 2,
        lng: Math.random() * Math.PI * 2,
      });
    }

    // Animation function
    function draw() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Floating offset
      const floatY = Math.sin(Date.now() / 1000) * 5;
      const cy = centerY + floatY;

      // Mouse tilt
      const tiltX = mouseY * 0.2;
      const tiltY = mouseX * 0.3;

      // Outer glow
      const gradient = ctx.createRadialGradient(centerX, cy, radius * 0.8, centerX, cy, radius * 1.4);
      gradient.addColorStop(0, 'rgba(34, 211, 238, 0.1)');
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, cy, radius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Draw latitude lines
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
      ctx.lineWidth = 1;

      for (let lat = -60; lat <= 60; lat += 30) {
        const latRad = (lat * Math.PI) / 180;
        const y = cy + Math.sin(latRad + tiltX) * radius;
        const radiusAtLat = Math.cos(latRad) * radius;

        ctx.beginPath();
        ctx.ellipse(centerX, y, radiusAtLat, radiusAtLat * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw longitude lines
      for (let lng = 0; lng < 360; lng += 30) {
        const lngRad = ((lng + rotation) * Math.PI) / 180;
        ctx.beginPath();

        for (let lat = -90; lat <= 90; lat += 5) {
          const latRad = (lat * Math.PI) / 180;
          const x = centerX + Math.cos(latRad) * Math.sin(lngRad + tiltY) * radius;
          const y = cy + Math.sin(latRad + tiltX) * radius;
          const z = Math.cos(latRad) * Math.cos(lngRad + tiltY);

          if (z > -0.1) {
            if (lat === -90) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
        }
        ctx.stroke();
      }

      // Draw connection points
      points.forEach((point, i) => {
        const lngRad = point.lng + rotation * (Math.PI / 180);
        const x = centerX + Math.cos(point.lat) * Math.sin(lngRad + tiltY) * radius;
        const y = cy + Math.sin(point.lat + tiltX) * radius;
        const z = Math.cos(point.lat) * Math.cos(lngRad + tiltY);

        if (z > 0) {
          const alpha = z * 0.8 + 0.2;
          const size = z * 3 + 1;

          // Glow
          ctx.fillStyle = `rgba(34, 211, 238, ${alpha * 0.5})`;
          ctx.beginPath();
          ctx.arc(x, y, size * 2, 0, Math.PI * 2);
          ctx.fill();

          // Point
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();

          // Connect to nearby points
          points.slice(i + 1).forEach((p2) => {
            const lng2Rad = p2.lng + rotation * (Math.PI / 180);
            const x2 = centerX + Math.cos(p2.lat) * Math.sin(lng2Rad + tiltY) * radius;
            const y2 = cy + Math.sin(p2.lat + tiltX) * radius;
            const z2 = Math.cos(p2.lat) * Math.cos(lng2Rad + tiltY);

            const dist = Math.sqrt((x - x2) ** 2 + (y - y2) ** 2);
            if (dist < 80 && z2 > 0) {
              const lineAlpha = (1 - dist / 80) * Math.min(z, z2) * 0.4;
              ctx.strokeStyle = `rgba(139, 92, 246, ${lineAlpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x2, y2);
              ctx.stroke();
            }
          });
        }
      });

      // Orbit ring
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(centerX, cy, radius * 1.3, radius * 0.4, rotation * 0.01, 0, Math.PI * 2);
      ctx.stroke();

      // Increment rotation
      rotation += 0.3;

      requestAnimationFrame(draw);
    }

    const animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[400px] max-h-[400px]"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
