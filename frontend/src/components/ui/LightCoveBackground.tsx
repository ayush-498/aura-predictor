import React, { useRef, useEffect } from 'react';

interface LightCoveBackgroundProps {
  className?: string;
  strandCountOverride?: number;
}

interface Point {
  x: number;
  y: number;
  len: number; // cumulative length from strand start
}

interface Pulse {
  dist: number;      // current distance along strand in CSS pixels
  speed: number;     // px per second
  tailLen: number;   // tail length in CSS pixels
  brightness: number;// peak brightness multiplier (0.7 - 1.0)
  headRadius: number;// radius for leading glowing point
}

interface Strand {
  points: Point[];
  totalLength: number;
  colorType: 'cyan' | 'electric' | 'amber';
  baseAlpha: number;
  lineWidth: number;
  pulses: Pulse[];
}

export const LightCoveBackground: React.FC<LightCoveBackgroundProps> = ({
  className = '',
  strandCountOverride,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId = 0;
    let isVisible = true;
    let lastTime = performance.now();

    let width = 0;
    let height = 0;
    let dpr = 1;
    let strands: Strand[] = [];

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Palette configurations
    // Predominantly electric blue & cyan, with occasional warm amber/gold
    const cyanPalette = [
      { r: 6, g: 182, b: 212 },   // cyan-500
      { r: 34, g: 211, b: 238 },  // cyan-400
      { r: 103, g: 232, b: 249 }, // cyan-300
    ];

    const electricPalette = [
      { r: 14, g: 165, b: 233 },  // sky-500
      { r: 56, g: 189, b: 248 },  // sky-400
      { r: 99, g: 102, b: 241 },  // indigo-500
      { r: 129, g: 140, b: 248 }, // indigo-400
    ];

    const amberPalette = [
      { r: 245, g: 158, b: 11 },  // amber-500
      { r: 251, g: 191, b: 36 },  // amber-400
      { r: 252, g: 211, b: 77 },  // amber-300
    ];

    const sampleStrandPoint = (strand: Strand, dist: number): { x: number; y: number } => {
      const pts = strand.points;
      if (dist <= 0) return { x: pts[0].x, y: pts[0].y };
      if (dist >= strand.totalLength) return { x: pts[pts.length - 1].x, y: pts[pts.length - 1].y };

      // Binary search along pre-calculated cumulative arc length
      let low = 0;
      let high = pts.length - 1;
      while (low <= high) {
        const mid = (low + high) >> 1;
        if (pts[mid].len < dist) low = mid + 1;
        else high = mid - 1;
      }

      const idx = Math.max(1, low);
      const pPrev = pts[idx - 1];
      const pNext = pts[idx];
      const segmentLen = pNext.len - pPrev.len;
      if (segmentLen <= 0.0001) return { x: pPrev.x, y: pPrev.y };

      const t = (dist - pPrev.len) / segmentLen;
      return {
        x: pPrev.x + (pNext.x - pPrev.x) * t,
        y: pPrev.y + (pNext.y - pPrev.y) * t,
      };
    };

    const buildStrands = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const isMobile = width < 768;
      const count = strandCountOverride ?? (isMobile ? 54 : 118);
      strands = [];

      const cx = width * 0.5;

      // Cove Geometry:
      // - Upper wall vertical section: y = 0 to bendStartY (~44% - 48% of screen)
      // - Smooth continuous rounded bend: bendStartY to bendEndY (~62% - 68% of screen)
      // - Floor section with perspective flare: bendEndY to bottom edge (~height + 40px)
      const bendStartY = height * 0.44;
      const bendEndY = height * 0.64;
      const bottomY = height + 40;

      for (let i = 0; i < count; i++) {
        // Distribute strands concentrated near horizontal center:
        // u in [-1, 1] with power curve concentration towards 0
        const norm = (i / (count - 1) - 0.5) * 2; // -1 to 1
        const sign = norm < 0 ? -1 : 1;
        const absVal = Math.abs(norm);
        // Exponent > 1 clusters density tightly in the central column
        const u = sign * Math.pow(absVal, 1.38);

        // Top wall coordinate: concentrated near horizontal center
        const topSpread = width * (isMobile ? 0.38 : 0.28);
        const xTop = cx + u * topSpread + (Math.random() - 0.5) * (width * 0.02);

        // Individualized bend landmarks for natural organic variety
        const strandBendStart = bendStartY + (Math.random() - 0.5) * (height * 0.06);
        const strandBendEnd = bendEndY + (Math.random() - 0.5) * (height * 0.06);

        // Bottom floor flare: fanning outward wide toward left and right edges
        const flareSpread = width * (isMobile ? 0.95 : 0.88);
        const xBottom = cx + u * flareSpread + sign * (width * 0.08) + (Math.random() - 0.5) * 25;

        // Intermediate curve control points for continuous rounded curvature
        // Wall descent is vertical -> dx/dy at top of bend is 0
        const p0 = { x: xTop, y: 0 };
        const p1 = { x: xTop, y: strandBendStart };

        // Curve tangent: smoothly bends outward into floor direction
        const xBendMid = xTop + (xBottom - xTop) * 0.22;
        const yBendMid = (strandBendStart + strandBendEnd) * 0.5;

        const p2 = { x: xBendMid, y: yBendMid };
        const p3 = { x: xBottom, y: bottomY };

        // Sample continuous points along this multi-segment smooth path
        const sampledPoints: Point[] = [];
        let runningLen = 0;

        const addPoint = (x: number, y: number) => {
          if (sampledPoints.length > 0) {
            const prev = sampledPoints[sampledPoints.length - 1];
            const dx = x - prev.x;
            const dy = y - prev.y;
            runningLen += Math.sqrt(dx * dx + dy * dy);
          }
          sampledPoints.push({ x, y, len: runningLen });
        };

        // 1. Wall section (vertical descent)
        const wallSteps = 24;
        for (let s = 0; s <= wallSteps; s++) {
          const t = s / wallSteps;
          addPoint(xTop, t * strandBendStart);
        }

        // 2. Cove bend section (Smooth cubic Bézier transition: continuous rounded curve, no sharp corner)
        // Tangent at p1 is purely downward (0, 1)
        const bendSteps = 32;
        const cp1x = xTop;
        const cp1y = strandBendStart + (strandBendEnd - strandBendStart) * 0.5;

        // Tangent entering floor: angled outward toward bottom target
        const floorAngleDx = (xBottom - xBendMid) * 0.45;
        const cp2x = xBendMid;
        const cp2y = strandBendEnd - (strandBendEnd - strandBendStart) * 0.15;

        for (let s = 1; s <= bendSteps; s++) {
          const t = s / bendSteps;
          const invT = 1 - t;
          const bx =
            invT * invT * invT * xTop +
            3 * invT * invT * t * cp1x +
            3 * invT * t * t * cp2x +
            t * t * t * xBendMid;
          const by =
            invT * invT * invT * strandBendStart +
            3 * invT * invT * t * cp1y +
            3 * invT * t * t * cp2y +
            t * t * t * strandBendEnd;
          addPoint(bx, by);
        }

        // 3. Floor section (fanning outward toward bottom edges in perspective)
        const floorSteps = 36;
        for (let s = 1; s <= floorSteps; s++) {
          const t = s / floorSteps;
          // Smooth acceleration outward as perspective broadens toward viewer
          const easeT = Math.pow(t, 1.15);
          const fx = xBendMid + (xBottom - xBendMid) * easeT;
          const fy = strandBendEnd + (bottomY - strandBendEnd) * t;
          addPoint(fx, fy);
        }

        const totalLength = runningLen;

        // Color designation: ~12% warm amber/gold, 48% electric blue, 40% cyan
        const randColor = Math.random();
        const colorType: 'cyan' | 'electric' | 'amber' =
          randColor < 0.13 ? 'amber' : randColor < 0.58 ? 'electric' : 'cyan';

        // Strand properties: 0.5 to 1.5 CSS pixels, natural variation
        const lineWidth = 0.55 + Math.random() * 0.85;
        // Central strands have slightly higher base luminosity
        const centerProximity = 1 - Math.min(1, absVal * 0.9);
        const baseAlpha = 0.09 + centerProximity * 0.14 + (Math.random() - 0.5) * 0.05;

        // Create 1-2 animated pulses per strand with randomized speed, starting position & trail
        const pulseCount = Math.random() < 0.65 ? 2 : 1;
        const pulses: Pulse[] = [];

        for (let p = 0; p < pulseCount; p++) {
          const initProgress = Math.random();
          pulses.push({
            dist: initProgress * totalLength,
            speed: 130 + Math.random() * 180 + centerProximity * 60, // 130 - 370 px/sec
            tailLen: 70 + Math.random() * 110,                       // 70 - 180 px trail
            brightness: 0.78 + Math.random() * 0.22,
            headRadius: lineWidth * (1.2 + Math.random() * 0.6),
          });
        }

        strands.push({
          points: sampledPoints,
          totalLength,
          colorType,
          baseAlpha,
          lineWidth,
          pulses,
        });
      }
    };

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // 1. Clear with deep nearly black background with generous dark space
      ctx.fillStyle = '#030509';
      ctx.fillRect(0, 0, width, height);

      // 2. Ambient floor cove glow (restrained bloom centered at the transition)
      const cx = width * 0.5;
      const bendMidY = height * 0.54;
      const glowGrad = ctx.createRadialGradient(cx, bendMidY, 15, cx, bendMidY, width * 0.5);
      glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.07)');
      glowGrad.addColorStop(0.35, 'rgba(14, 165, 233, 0.035)');
      glowGrad.addColorStop(0.75, 'rgba(3, 5, 9, 0.0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Floor plane subtle specular reflection glow
      const floorGrad = ctx.createLinearGradient(0, bendMidY, 0, height);
      floorGrad.addColorStop(0, 'rgba(14, 165, 233, 0.03)');
      floorGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.02)');
      floorGrad.addColorStop(1, 'rgba(3, 5, 9, 0.0)');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, bendMidY, width, height - bendMidY);

      // 3. Draw underlying stable strands
      for (let i = 0; i < strands.length; i++) {
        const s = strands[i];
        const pts = s.points;
        if (pts.length < 2) continue;

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let j = 1; j < pts.length; j++) {
          ctx.lineTo(pts[j].x, pts[j].y);
        }

        let rgb = '34, 211, 238'; // cyan default
        if (s.colorType === 'electric') rgb = '56, 189, 248';
        else if (s.colorType === 'amber') rgb = '245, 158, 11';

        ctx.strokeStyle = `rgba(${rgb}, ${s.baseAlpha.toFixed(3)})`;
        ctx.lineWidth = s.lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // 4. Animate bright pulses traveling DOWNWARD along each strand
      if (!prefersReducedMotion) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter'; // Restrained bloom & optical addition

        for (let i = 0; i < strands.length; i++) {
          const s = strands[i];

          let headRgb = '103, 232, 249'; // bright cyan
          let coreRgb = '224, 242, 254'; // white-tinted cyan
          if (s.colorType === 'electric') {
            headRgb = '56, 189, 248';
            coreRgb = '240, 249, 255';
          } else if (s.colorType === 'amber') {
            headRgb = '251, 191, 36';
            coreRgb = '254, 243, 199';
          }

          for (let pIdx = 0; pIdx < s.pulses.length; pIdx++) {
            const p = s.pulses[pIdx];

            // Update distance along strand
            p.dist += p.speed * dt;
            // Seamless wrap-around with fresh randomized speed & tail
            if (p.dist - p.tailLen > s.totalLength) {
              p.dist = -Math.random() * (s.totalLength * 0.15);
              p.speed = 130 + Math.random() * 190;
              p.tailLen = 70 + Math.random() * 110;
            }

            // Pulse trailing gradient: segment from tail to head
            const headDist = p.dist;
            const tailDist = Math.max(0, headDist - p.tailLen);
            if (headDist <= 0 || tailDist >= s.totalLength) continue;

            const segments = 10;
            const stepLen = (headDist - tailDist) / segments;

            for (let seg = 0; seg < segments; seg++) {
              const d1 = tailDist + seg * stepLen;
              const d2 = tailDist + (seg + 1) * stepLen;
              if (d1 >= s.totalLength) break;

              const pt1 = sampleStrandPoint(s, d1);
              const pt2 = sampleStrandPoint(s, Math.min(s.totalLength, d2));

              // Quadratic falloff towards tail for smooth natural taper
              const normProgress = (seg + 1) / segments;
              const alpha = Math.pow(normProgress, 1.8) * p.brightness * 0.82;

              ctx.beginPath();
              ctx.moveTo(pt1.x, pt1.y);
              ctx.lineTo(pt2.x, pt2.y);
              ctx.strokeStyle = `rgba(${headRgb}, ${alpha.toFixed(3)})`;
              ctx.lineWidth = s.lineWidth * (0.8 + normProgress * 0.85);
              ctx.stroke();
            }

            // Bright leading point (glowing spark at pulse head)
            if (headDist >= 0 && headDist <= s.totalLength) {
              const headPt = sampleStrandPoint(s, headDist);

              // Outer bloom
              ctx.beginPath();
              ctx.arc(headPt.x, headPt.y, p.headRadius * 2.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${headRgb}, ${Math.min(1, p.brightness * 0.45)})`;
              ctx.fill();

              // Intense core
              ctx.beginPath();
              ctx.arc(headPt.x, headPt.y, p.headRadius, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${coreRgb}, ${Math.min(1, p.brightness * 0.95)})`;
              ctx.fill();
            }
          }
        }

        ctx.restore();
      }

      // 5. Perimeter edge & bottom vignettes: fade outer edges smoothly into black
      // Left edge dark fade
      const leftFade = ctx.createLinearGradient(0, 0, width * 0.22, 0);
      leftFade.addColorStop(0, 'rgba(3, 5, 9, 0.94)');
      leftFade.addColorStop(1, 'rgba(3, 5, 9, 0)');
      ctx.fillStyle = leftFade;
      ctx.fillRect(0, 0, width * 0.22, height);

      // Right edge dark fade
      const rightFade = ctx.createLinearGradient(width, 0, width * 0.78, 0);
      rightFade.addColorStop(0, 'rgba(3, 5, 9, 0.94)');
      rightFade.addColorStop(1, 'rgba(3, 5, 9, 0)');
      ctx.fillStyle = rightFade;
      ctx.fillRect(width * 0.78, 0, width * 0.22, height);

      // Bottom edge dark fade
      const bottomFade = ctx.createLinearGradient(0, height * 0.86, 0, height);
      bottomFade.addColorStop(0, 'rgba(3, 5, 9, 0)');
      bottomFade.addColorStop(1, 'rgba(3, 5, 9, 0.98)');
      ctx.fillStyle = bottomFade;
      ctx.fillRect(0, height * 0.86, width, height * 0.14);

      // Top edge gentle dark fade
      const topFade = ctx.createLinearGradient(0, 0, 0, height * 0.12);
      topFade.addColorStop(0, 'rgba(3, 5, 9, 0.85)');
      topFade.addColorStop(1, 'rgba(3, 5, 9, 0)');
      ctx.fillStyle = topFade;
      ctx.fillRect(0, 0, width, height * 0.12);

      if (isVisible && !prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    const handleResize = () => {
      buildStrands();
      if (prefersReducedMotion) {
        render(performance.now());
      }
    };

    const onVisibilityChange = () => {
      isVisible = document.visibilityState !== 'hidden';
      if (isVisible && !prefersReducedMotion) {
        lastTime = performance.now();
        animId = requestAnimationFrame(render);
      }
    };

    buildStrands();

    if (prefersReducedMotion) {
      render(performance.now());
    } else {
      animId = requestAnimationFrame(render);
    }

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [strandCountOverride]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#030509] ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
