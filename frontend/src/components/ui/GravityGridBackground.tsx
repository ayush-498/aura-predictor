import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const GravityGridBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      if (containerRef.current) {
        containerRef.current.classList.add('canvas-failed');
      }
      return;
    }

    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId = 0;
    let isVisible = true;
    let isIdle = false;
    let lastTime = performance.now();

    // Viewport & grid dimensions
    let width = 0;
    let height = 0;
    let dpr = 1;
    let spacing = 30;

    // One Gaussian field parameters
    let R = 210; // influence radius in CSS pixels
    let sigma = R / 3;
    let gR = Math.exp(-(R * R) / (2 * sigma * sigma));
    let invDenominator = 1 / (1 - gR);
    const strength = 0.46; // deformation pull strength (below 1 to prevent collapse)

    // Precomputed base grid coordinates
    let cols = 0;
    let rows = 0;
    let restingDotsPath = new Path2D();

    // Pointer dynamics
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let hasPointer = false;
    let presence = 0; // 0 (hidden/resting) to 1 (active)
    let targetPresence = 0;

    const rebuildBaseGrid = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Adapt spacing and radius to screen dimensions
      spacing = width < 640 ? 26 : width < 1200 ? 30 : 32;
      R = Math.max(180, Math.min(230, Math.min(width, height) * 0.28));
      sigma = R / 3;
      gR = Math.exp(-(R * R) / (2 * sigma * sigma));
      invDenominator = 1 / (1 - gR);

      cols = Math.ceil(width / spacing) + 1;
      rows = Math.ceil(height / spacing) + 1;

      // Precompute the almost invisible resting dot grid
      restingDotsPath = new Path2D();
      for (let i = 0; i <= cols; i++) {
        const x = i * spacing;
        for (let j = 0; j <= rows; j++) {
          const y = j * spacing;
          restingDotsPath.moveTo(x + 0.75, y);
          restingDotsPath.arc(x, y, 0.75, 0, Math.PI * 2);
        }
      }

      if (!hasPointer && !isTouch && !prefersReducedMotion) {
        currentX = width * 0.5;
        currentY = height * 0.4;
        targetX = currentX;
        targetY = currentY;
      }

      isIdle = false;
      renderFrame(performance.now(), true);
    };

    // Gaussian weight calculation function
    const getGaussianWeight = (px: number, py: number, cx: number, cy: number): number => {
      const dx = px - cx;
      const dy = py - cy;
      const d2 = dx * dx + dy * dy;
      if (d2 >= R * R) return 0;

      const gd = Math.exp(-d2 / (2 * sigma * sigma));
      let w = (gd - gR) * invDenominator;
      if (w <= 0) return 0;
      if (w >= 1) return 1;

      // Smoothstep to soften the outer boundary cleanly
      return w * w * (3 - 2 * w);
    };

    // Deformed point calculation from original coordinates
    const getDeformedPoint = (
      origX: number,
      origY: number,
      cx: number,
      cy: number,
      currentPresence: number
    ): { x: number; y: number; w: number } => {
      const w = getGaussianWeight(origX, origY, cx, cy);
      if (w <= 0 || currentPresence <= 0.001) {
        return { x: origX, y: origY, w: 0 };
      }
      const effStrength = strength * currentPresence;
      const dx = cx - origX;
      const dy = cy - origY;
      return {
        x: origX + effStrength * w * dx,
        y: origY + effStrength * w * dy,
        w: w * currentPresence,
      };
    };

    const renderFrame = (timestamp: number, force = false) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
      lastTime = timestamp;

      if (!isTouch && !prefersReducedMotion) {
        // Smooth pointer tracking easing
        const lerpFactor = 1 - Math.exp(-8.5 * dt);
        currentX += (targetX - currentX) * lerpFactor;
        currentY += (targetY - currentY) * lerpFactor;

        // Smooth presence fade in/out easing
        const fadeSpeed = hasPointer ? 5.5 : 3.8;
        const fadeFactor = 1 - Math.exp(-fadeSpeed * dt);
        presence += (targetPresence - presence) * fadeFactor;

        // When pointer exited and presence settles, pause RAF loop
        if (!hasPointer && presence < 0.002 && !force) {
          presence = 0;
          isIdle = true;
        }
      } else {
        // Static resting highlight for touch / reduced motion
        currentX = width * 0.5;
        currentY = height * 0.38;
        presence = 0.28;
        isIdle = true;
      }

      // 1. Clear background completely to prevent ghosting or trails
      ctx.fillStyle = isDark ? '#060709' : '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw the base almost invisible dot grid
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.035)' : 'rgba(15, 23, 42, 0.04)';
      ctx.fill(restingDotsPath);

      // If presence is 0, nothing else needs to be drawn
      if (presence <= 0.001) {
        return;
      }

      // 3. Draw soft, localized radial glow strictly within circular radius R
      const radialGlow = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, R);
      if (isDark) {
        radialGlow.addColorStop(0, `rgba(190, 242, 100, ${0.14 * presence})`);
        radialGlow.addColorStop(0.35, `rgba(163, 230, 53, ${0.07 * presence})`);
        radialGlow.addColorStop(0.75, `rgba(132, 204, 22, ${0.02 * presence})`);
        radialGlow.addColorStop(1, 'rgba(6, 7, 9, 0)');
      } else {
        radialGlow.addColorStop(0, `rgba(132, 204, 22, ${0.08 * presence})`);
        radialGlow.addColorStop(0.4, `rgba(163, 230, 53, ${0.03 * presence})`);
        radialGlow.addColorStop(1, 'rgba(248, 250, 252, 0)');
      }

      ctx.beginPath();
      ctx.arc(currentX, currentY, R, 0, Math.PI * 2);
      ctx.fillStyle = radialGlow;
      ctx.fill();

      // 4. Draw deformed grid lines only within active radius R
      // Determine grid index bounding box around pointer to skip 95% of off-field segments
      const minCol = Math.max(0, Math.floor((currentX - R - spacing) / spacing));
      const maxCol = Math.min(cols, Math.ceil((currentX + R + spacing) / spacing));
      const minRow = Math.max(0, Math.floor((currentY - R - spacing) / spacing));
      const maxRow = Math.min(rows, Math.ceil((currentY + R + spacing) / spacing));

      const SUBDIVISIONS = 4; // Subdivide segments to produce smooth rubber-sheet curves
      const linesPath = new Path2D();
      const dotsPath = new Path2D();

      // Horizontal connecting segments
      for (let j = minRow; j <= maxRow; j++) {
        const origY = j * spacing;
        for (let i = minCol; i < maxCol; i++) {
          const x0 = i * spacing;
          const x1 = (i + 1) * spacing;

          // Check if segment is within radius R
          const midX = (x0 + x1) * 0.5;
          const distToCenter = Math.hypot(midX - currentX, origY - currentY);
          if (distToCenter > R + spacing * 0.6) continue;

          // Sample sub-segment points
          const pStart = getDeformedPoint(x0, origY, currentX, currentY, presence);
          linesPath.moveTo(pStart.x, pStart.y);

          for (let s = 1; s <= SUBDIVISIONS; s++) {
            const t = s / SUBDIVISIONS;
            const px = x0 + t * (x1 - x0);
            const pt = getDeformedPoint(px, origY, currentX, currentY, presence);
            linesPath.lineTo(pt.x, pt.y);
          }
        }
      }

      // Vertical connecting segments
      for (let i = minCol; i <= maxCol; i++) {
        const origX = i * spacing;
        for (let j = minRow; j < maxRow; j++) {
          const y0 = j * spacing;
          const y1 = (j + 1) * spacing;

          // Check if segment is within radius R
          const midY = (y0 + y1) * 0.5;
          const distToCenter = Math.hypot(origX - currentX, midY - currentY);
          if (distToCenter > R + spacing * 0.6) continue;

          // Sample sub-segment points
          const pStart = getDeformedPoint(origX, y0, currentX, currentY, presence);
          linesPath.moveTo(pStart.x, pStart.y);

          for (let s = 1; s <= SUBDIVISIONS; s++) {
            const t = s / SUBDIVISIONS;
            const py = y0 + t * (y1 - y0);
            const pt = getDeformedPoint(origX, py, currentX, currentY, presence);
            linesPath.lineTo(pt.x, pt.y);
          }
        }
      }

      // 5. Stroke connecting lines with one smooth radial gradient fading to 0 at R
      const lineGradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, R);
      if (isDark) {
        lineGradient.addColorStop(0, `rgba(217, 249, 157, ${0.75 * presence})`);
        lineGradient.addColorStop(0.35, `rgba(190, 242, 100, ${0.50 * presence})`);
        lineGradient.addColorStop(0.70, `rgba(163, 230, 53, ${0.20 * presence})`);
        lineGradient.addColorStop(1, 'rgba(163, 230, 53, 0)');
      } else {
        lineGradient.addColorStop(0, `rgba(101, 163, 13, ${0.60 * presence})`);
        lineGradient.addColorStop(0.40, `rgba(132, 204, 22, ${0.35 * presence})`);
        lineGradient.addColorStop(1, 'rgba(132, 204, 22, 0)');
      }

      ctx.strokeStyle = lineGradient;
      ctx.lineWidth = 1.15;
      ctx.stroke(linesPath);

      // 6. Draw illuminated dots at deformed grid intersections near center
      for (let i = minCol; i <= maxCol; i++) {
        const origX = i * spacing;
        for (let j = minRow; j <= maxRow; j++) {
          const origY = j * spacing;
          const pt = getDeformedPoint(origX, origY, currentX, currentY, presence);
          if (pt.w > 0.02) {
            const dotRadius = 0.75 + pt.w * 0.85;
            dotsPath.moveTo(pt.x + dotRadius, pt.y);
            dotsPath.arc(pt.x, pt.y, dotRadius, 0, Math.PI * 2);
          }
        }
      }

      const dotGradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, R);
      if (isDark) {
        dotGradient.addColorStop(0, `rgba(240, 253, 180, ${0.9 * presence})`);
        dotGradient.addColorStop(0.4, `rgba(190, 242, 100, ${0.6 * presence})`);
        dotGradient.addColorStop(0.8, `rgba(163, 230, 53, ${0.2 * presence})`);
        dotGradient.addColorStop(1, 'rgba(163, 230, 53, 0)');
      } else {
        dotGradient.addColorStop(0, `rgba(101, 163, 13, ${0.8 * presence})`);
        dotGradient.addColorStop(0.5, `rgba(132, 204, 22, ${0.4 * presence})`);
        dotGradient.addColorStop(1, 'rgba(132, 204, 22, 0)');
      }

      ctx.fillStyle = dotGradient;
      ctx.fill(dotsPath);
    };

    const loop = (timestamp: number) => {
      if (!isVisible || isIdle) return;
      renderFrame(timestamp);
      animId = requestAnimationFrame(loop);
    };

    // Event handlers
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;

      // On initial pointer entry, snap center directly to entry position to avoid fly-in
      if (!hasPointer) {
        currentX = e.clientX;
        currentY = e.clientY;
        targetX = e.clientX;
        targetY = e.clientY;
      } else {
        targetX = e.clientX;
        targetY = e.clientY;
      }

      hasPointer = true;
      targetPresence = 1.0;

      if (isIdle) {
        isIdle = false;
        lastTime = performance.now();
        animId = requestAnimationFrame(loop);
      }
    };

    const onPointerLeave = () => {
      hasPointer = false;
      targetPresence = 0.0;

      if (isIdle) {
        isIdle = false;
        lastTime = performance.now();
        animId = requestAnimationFrame(loop);
      }
    };

    const onVisibilityChange = () => {
      isVisible = document.visibilityState !== 'hidden';
      if (isVisible && !isIdle && !prefersReducedMotion && !isTouch) {
        lastTime = performance.now();
        animId = requestAnimationFrame(loop);
      }
    };

    rebuildBaseGrid();

    window.addEventListener('resize', rebuildBaseGrid, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('blur', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);

    if (!prefersReducedMotion && !isTouch) {
      animId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', rebuildBaseGrid);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('blur', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="gravity-grid-fallback" />
    </div>
  );
};
