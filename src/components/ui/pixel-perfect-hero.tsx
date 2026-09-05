"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const BRAND_LOGOS = [
  () => (
    <span className="font-bold text-base md:text-xl text-foreground/75 opacity-60 transition-opacity duration-300 hover:opacity-100">
      CPIC
    </span>
  ),
  () => (
    <span className="font-bold text-base md:text-xl text-foreground/75 opacity-60 transition-opacity duration-300 hover:opacity-100">
      PharmGKB
    </span>
  ),
  () => (
    <span className="font-bold text-base md:text-xl text-foreground/75 opacity-60 transition-opacity duration-300 hover:opacity-100">
      DPWG
    </span>
  ),
  () => (
    <span className="font-bold text-base md:text-xl text-foreground/75 opacity-60 transition-opacity duration-300 hover:opacity-100">
      FDA biomarkers
    </span>
  ),
  () => (
    <span className="font-bold text-base md:text-xl text-foreground/75 opacity-60 transition-opacity duration-300 hover:opacity-100">
      ESC guidelines
    </span>
  ),
];

type Pixel = {
  x: number;
  y: number;
  color: string;
  ctx: CanvasRenderingContext2D;
  speed: number;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeInt: number;
  maxSize: number;
  delay: number;
  counter: number;
  counterStep: number;
  isIdle: boolean;
  isReverse: boolean;
  isShimmer: boolean;
  draw: () => void;
  appear: () => void;
  disappear: () => void;
  shimmer: () => void;
};

function createPixel(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  color: string,
  baseSpeed: number,
  delay: number,
): Pixel {
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;
  const pixel: Pixel = {
    x,
    y,
    color,
    ctx,
    speed: rand(0.08, 0.4) * baseSpeed,
    size: 0,
    sizeStep: rand(0.12, 0.28),
    minSize: 0.5,
    maxSizeInt: 2,
    maxSize: rand(0.5, 2),
    delay,
    counter: 0,
    counterStep: rand(1.8, 3.2) + (canvas.width + canvas.height) * 0.008,
    isIdle: false,
    isReverse: false,
    isShimmer: false,
    draw() {
      const offset = pixel.maxSizeInt * 0.5 - pixel.size * 0.5;
      ctx.fillStyle = pixel.color;
      ctx.fillRect(pixel.x + offset, pixel.y + offset, pixel.size, pixel.size);
    },
    appear() {
      pixel.isIdle = false;
      if (pixel.counter <= pixel.delay) {
        pixel.counter += pixel.counterStep;
        return;
      }
      if (pixel.size >= pixel.maxSize) pixel.isShimmer = true;
      if (pixel.isShimmer) pixel.shimmer();
      else pixel.size += pixel.sizeStep;
      pixel.draw();
    },
    disappear() {
      pixel.isShimmer = false;
      pixel.counter = 0;
      if (pixel.size <= 0) {
        pixel.isIdle = true;
        return;
      }
      pixel.size -= 0.1;
      pixel.draw();
    },
    shimmer() {
      if (pixel.size >= pixel.maxSize) pixel.isReverse = true;
      else if (pixel.size <= pixel.minSize) pixel.isReverse = false;
      if (pixel.isReverse) pixel.size -= pixel.speed;
      else pixel.size += pixel.speed;
    },
  };
  return pixel;
}

function PixelCanvas({
  colors,
  gap = 6,
  speed = 30,
}: {
  colors: string[];
  gap?: number;
  speed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number>(0);
  const lastFrameRef = useRef(performance.now());
  const reducedMotionRef = useRef(false);
  const init = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || !colors.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = wrap.getBoundingClientRect();
    const w = Math.floor(width);
    const h = Math.floor(height);
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const pixels: Pixel[] = [];
    const effectiveSpeed = reducedMotionRef.current
      ? 0
      : Math.min(speed, 100) * 0.001;
    for (let x = 0; x < w; x += gap)
      for (let y = 0; y < h; y += gap) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const delay = reducedMotionRef.current
          ? 0
          : Math.hypot(x - w / 2, y - h / 2) * 0.65;
        pixels.push(
          createPixel(ctx, canvas, x, y, color, effectiveSpeed, delay),
        );
      }
    pixelsRef.current = pixels;
  }, [colors, gap, speed]);
  const animate = useCallback((mode: "appear" | "disappear") => {
    cancelAnimationFrame(animationRef.current);
    const frameInterval = 1000 / 60;
    const loop = () => {
      animationRef.current = requestAnimationFrame(loop);
      const now = performance.now();
      const elapsed = now - lastFrameRef.current;
      if (elapsed < frameInterval) return;
      lastFrameRef.current = now - (elapsed % frameInterval);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const pixel of pixelsRef.current) pixel[mode]();
      if (pixelsRef.current.every((pixel) => pixel.isIdle))
        cancelAnimationFrame(animationRef.current);
    };
    animationRef.current = requestAnimationFrame(loop);
  }, []);
  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    init();
    const observer = new ResizeObserver(init);
    if (wrapRef.current) observer.observe(wrapRef.current);
    animate("appear");
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate, init]);
  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

export interface PixelHeroProps {
  word1?: string;
  word2?: string;
  description?: string;
  primaryCta?: string;
  primaryCtaMobile?: string;
  secondaryCta?: string;
  secondaryCtaMobile?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  secondaryHref?: string;
}

export function PixelHero({
  word1 = "Clinical",
  word2 = "precision.",
  description = "A clear clinical workspace where pharmacogenomic signals, labs and medication context remain visible and explainable.",
  primaryCta = "Request access",
  primaryCtaMobile = "Access",
  secondaryCta = "Sign in",
  secondaryCtaMobile = "Sign in",
  onPrimaryClick,
  onSecondaryClick,
  secondaryHref = "/login",
}: PixelHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [themeColors, setThemeColors] = useState<string[]>([]);
  useEffect(() => {
    setThemeColors([
      "rgba(130, 160, 170, 0.52)",
      "rgba(130, 160, 170, 0.52)",
      "rgba(130, 160, 170, 0.52)",
      "rgba(130, 160, 170, 0.52)",
      "#2AF0EA",
    ]);
    const timer = window.setTimeout(() => setIsLoaded(true), 50);
    return () => window.clearTimeout(timer);
  }, []);
  const sources = (
    <>
      {BRAND_LOGOS.map((Logo, index) => (
        <Logo key={index} />
      ))}
    </>
  );
  return (
    <section className="relative isolate flex min-h-[100dvh] w-full select-none flex-col justify-between overflow-hidden bg-background px-2 py-8 md:justify-center md:gap-6 md:px-6 md:py-0">
      <style>{`@keyframes pixel-marquee { from { transform: translateX(0%); } to { transform: translateX(-50%); } } .pixel-marquee { animation: pixel-marquee 25s linear infinite; } .tahoe-glass-text { color: transparent; background: linear-gradient(135deg,#f2ffff 0%,rgba(183,228,232,.45) 25%,rgba(99,171,177,.2) 45%,#e8ffff 55%,rgba(128,224,219,.3) 75%,#f7ffff 100%); background-size: 200% auto; -webkit-background-clip:text; background-clip:text; -webkit-text-stroke:1.5px rgba(214,255,252,.27); filter:drop-shadow(0 15px 35px rgba(0,0,0,.4)) drop-shadow(0 5px 10px rgba(0,0,0,.2)); animation:pixel-shimmer 8s linear infinite; } @keyframes pixel-shimmer { from { background-position:200% center; } to { background-position:0 center; } } @media (prefers-reduced-motion:reduce) { .pixel-marquee,.tahoe-glass-text { animation:none; } }`}</style>
      <div className="pointer-events-none absolute inset-0 z-0">
        <>
          {themeColors.length > 0 && (
            <PixelCanvas colors={themeColors} gap={6} speed={30} />
          )}
        </>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)] opacity-80" />
      </div>
      <div className="pointer-events-none z-10 mt-28 flex w-full flex-col items-center justify-center text-center sm:mt-0">
        <h1 className="tahoe-glass-text flex w-full flex-row flex-wrap items-center justify-center gap-1.5 px-1 text-[2.8rem] leading-none xs:text-[3.2rem] sm:gap-4 sm:text-6xl md:text-8xl lg:gap-6 lg:text-9xl">
          <span className="font-serif text-balance italic font-medium">
            {word1}
          </span>
          <span className="font-sans font-extrabold tracking-tighter">
            {word2}
          </span>
        </h1>
      </div>
      <div className="pointer-events-none z-10 my-auto flex w-full flex-col items-center justify-center px-1 text-center md:my-0">
        <p className="max-w-[95%] px-1 text-sm font-light leading-relaxed text-foreground/85 sm:max-w-md sm:text-lg md:max-w-xl md:text-xl">
          {description}
        </p>
        <div className="pointer-events-auto mt-14 block w-full md:hidden">
          <div className="mb-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
            Trusted evidence sources
          </div>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
            <div className="pixel-marquee flex w-max gap-12 py-1">
              <div className="flex items-center gap-12">{sources}</div>
              <div className="flex items-center gap-12" aria-hidden="true">
                {sources}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "pointer-events-auto z-10 order-4 mt-4 mb-4 flex flex-row items-center justify-center gap-3 px-1 transition-all duration-1000 md:order-3 md:mt-10 md:mb-0",
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        )}
        style={{ transitionDelay: "450ms" }}
      >
        <button
          onClick={onPrimaryClick}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-b from-primary/90 to-primary px-4 text-xs font-semibold text-primary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.15),0_12px_24px_rgba(0,0,0,0.15)] ring-1 ring-primary/20 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] md:h-12 md:gap-2 md:px-8 md:text-sm"
        >
          <span className="inline md:hidden">{primaryCtaMobile}</span>
          <span className="hidden md:inline">{primaryCta}</span>
          <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </button>
        <a
          href={secondaryHref}
          onClick={onSecondaryClick}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-b from-card/80 to-card px-4 text-xs font-semibold text-card-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.05),0_12px_24px_rgba(0,0,0,0.05)] ring-1 ring-border/50 backdrop-blur-md transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] md:h-12 md:gap-2 md:px-8 md:text-sm"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-primary md:h-4 md:w-4" />
          <span className="inline md:hidden">{secondaryCtaMobile}</span>
          <span className="hidden md:inline">{secondaryCta}</span>
        </a>
      </div>
      <div
        className={cn(
          "pointer-events-auto absolute right-0 bottom-8 left-0 z-10 hidden w-full flex-col items-center justify-center gap-4 transition-all duration-1000 md:flex",
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        )}
        style={{ transitionDelay: "600ms" }}
      >
        <span className="select-none text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
          Trusted evidence sources
        </span>
        <div className="relative w-full max-w-5xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
          <div className="pixel-marquee flex w-max gap-16 py-3">
            <div className="flex items-center gap-16">{sources}</div>
            <div className="flex items-center gap-16" aria-hidden="true">
              {sources}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
