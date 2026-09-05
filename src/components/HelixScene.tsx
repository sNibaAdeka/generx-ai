'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const HelixCanvas = dynamic(() => import('./HelixCanvas'), { ssr: false });

export function HelixScene({ compact = false }: { compact?: boolean }) {
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const choose = () => setReducedMotion(query.matches || navigator.hardwareConcurrency <= 2);
    choose();
    query.addEventListener('change', choose);
    return () => query.removeEventListener('change', choose);
  }, []);

  return (
    <div className={`helix-scene ${compact ? 'helix-scene--compact' : ''}`}>
      <Image src="/helix-poster.png" alt="" fill priority sizes="(max-width: 900px) 100vw, 65vw" className="helix-poster" />
      {!reducedMotion && <div className="helix-canvas"><HelixCanvas /></div>}
      <div className="helix-vignette" />
    </div>
  );
}
