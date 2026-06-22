"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  life: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const stars: Star[] = [];
    const shootingStars: ShootingStar[] = [];
    const starCount = 150;
    const time = { value: 0 };

    const STAR_COLORS = [
      "rgba(255, 255, 255, ",
      "rgba(230, 238, 255, ",
      "rgba(255, 248, 220, ",
      "rgba(197, 179, 235, ",
      "rgba(173, 216, 230, ",
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStar = (): Star => {
      const colorIndex = Math.random() < 0.6 ? 0 : Math.random() < 0.8 ? 1 : Math.floor(Math.random() * STAR_COLORS.length);
      const baseSize = Math.random();
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: baseSize < 0.7 ? baseSize * 0.4 + 0.1 : baseSize * 0.6 + 0.15,
        baseOpacity: Math.random() * 0.6 + 0.3,
        opacity: Math.random() * 0.6 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        color: STAR_COLORS[colorIndex],
      };
    };

    const createShootingStar = (): ShootingStar => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      length: Math.random() * 80 + 40,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      speed: Math.random() * 8 + 4,
      opacity: Math.random() * 0.6 + 0.4,
      life: 1,
    });

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        stars.push(createStar());
      }
    };

    const drawStar = (star: Star) => {
      const gradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.size * 4
      );
      gradient.addColorStop(0, star.color + star.opacity + ")");
      gradient.addColorStop(0.3, star.color + (star.opacity * 0.5) + ")");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = star.color + star.opacity + ")";
      ctx.fill();
    };

    const drawShootingStar = (ss: ShootingStar) => {
      const tailX = ss.x - Math.cos(ss.angle) * ss.length;
      const tailY = ss.y - Math.sin(ss.angle) * ss.length;

      const gradient = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      gradient.addColorStop(0.5, "rgba(200, 220, 255, " + ss.opacity * 0.5 + ")");
      gradient.addColorStop(1, "rgba(255, 255, 255, " + ss.opacity + ")");

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(ss.x, ss.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, " + ss.opacity + ")";
      ctx.fill();
    };

    const animate = () => {
      ctx.fillStyle = "rgba(5, 3, 12, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time.value += 0.016;

      stars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        star.opacity = star.baseOpacity + Math.sin(star.twinklePhase) * 0.3;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));
        drawStar(star);
      });

      if (Math.random() < 0.005) {
        shootingStars.push(createShootingStar());
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.life -= 0.02;
        ss.opacity = ss.life;

        if (ss.life <= 0 || ss.x > canvas.width + 100 || ss.y > canvas.height + 100) {
          shootingStars.splice(i, 1);
        } else {
          drawShootingStar(ss);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initStars();
    animate();

    window.addEventListener("resize", () => {
      resizeCanvas();
      initStars();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
}