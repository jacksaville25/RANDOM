import React from 'react';
import { DemonDifficulty } from '../types';

interface DemonFaceProps {
  difficulty?: DemonDifficulty;
  className?: string;
  size?: number;
}

export const DemonFace: React.FC<DemonFaceProps> = ({ difficulty = 'extreme', className = '', size = 28 }) => {
  if (difficulty === 'top_10') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={`filter drop-shadow-[0_0_8px_rgba(245,158,11,0.7)] ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="48" fill="#180407" stroke="#F59E0B" strokeWidth="4" />
        {/* Infernal Horns */}
        <path d="M 22 34 Q 10 10 24 6 Q 30 18 34 30 Z" fill="#EF4444" stroke="#F59E0B" strokeWidth="2" />
        <path d="M 78 34 Q 90 10 76 6 Q 70 18 66 30 Z" fill="#EF4444" stroke="#F59E0B" strokeWidth="2" />
        {/* Demon Head */}
        <circle cx="50" cy="56" r="32" fill="#DC2626" />
        {/* Angry Brow */}
        <path d="M 26 44 L 50 56 L 74 44" stroke="#450A0A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        {/* Fiery Glowing Eyes */}
        <ellipse cx="36" cy="52" rx="7" ry="5" fill="#FEF08A" />
        <ellipse cx="64" cy="52" rx="7" ry="5" fill="#FEF08A" />
        <circle cx="36" cy="52" r="3" fill="#B91C1C" />
        <circle cx="64" cy="52" r="3" fill="#B91C1C" />
        {/* Mouth with Sharp Fangs */}
        <path d="M 30 68 Q 50 82 70 68 Z" fill="#450A0A" />
        <polygon points="34,68 38,76 42,68" fill="#FFFFFF" />
        <polygon points="46,68 50,78 54,68" fill="#FFFFFF" />
        <polygon points="58,68 62,76 66,68" fill="#FFFFFF" />
        {/* Crown / Top 10 Star */}
        <polygon points="50,14 53,22 62,22 55,27 58,35 50,30 42,35 45,27 38,22 47,22" fill="#FBBF24" />
      </svg>
    );
  }

  if (difficulty === 'extreme' || difficulty === 'legendary_extreme') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={`filter drop-shadow-[0_0_6px_rgba(239,68,68,0.6)] ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="46" fill="#1C090C" stroke="#EF4444" strokeWidth="3" />
        {/* Horns */}
        <path d="M 24 36 Q 14 16 26 12 Q 32 22 36 32 Z" fill="#DC2626" />
        <path d="M 76 36 Q 86 16 74 12 Q 68 22 64 32 Z" fill="#DC2626" />
        {/* Face */}
        <circle cx="50" cy="54" r="30" fill="#EF4444" />
        {/* Slanted Eyes */}
        <polygon points="28,42 45,51 32,54" fill="#000000" />
        <polygon points="72,42 55,51 68,54" fill="#000000" />
        <circle cx="37" cy="48" r="2.5" fill="#FEF08A" />
        <circle cx="63" cy="48" r="2.5" fill="#FEF08A" />
        {/* Jagged Mouth */}
        <path d="M 32 66 Q 50 78 68 66 Z" fill="#260407" />
        <polygon points="36,66 40,73 44,66" fill="#FFFFFF" />
        <polygon points="48,66 52,74 56,66" fill="#FFFFFF" />
        <polygon points="60,66 64,73 68,66" fill="#FFFFFF" />
      </svg>
    );
  }

  if (difficulty === 'insane') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={`filter drop-shadow-[0_0_5px_rgba(249,115,22,0.5)] ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="44" fill="#1B1008" stroke="#F97316" strokeWidth="3" />
        <circle cx="50" cy="50" r="32" fill="#FB923C" />
        {/* Eyes */}
        <ellipse cx="36" cy="46" rx="6" ry="7" fill="#000000" />
        <ellipse cx="64" cy="46" rx="6" ry="7" fill="#000000" />
        <circle cx="38" cy="44" r="2" fill="#FFFFFF" />
        <circle cx="66" cy="44" r="2" fill="#FFFFFF" />
        {/* Menacing smile */}
        <path d="M 32 64 Q 50 80 68 64 Z" fill="#431407" />
        <polygon points="40,64 43,71 46,64" fill="#FFFFFF" />
        <polygon points="54,64 57,71 60,64" fill="#FFFFFF" />
      </svg>
    );
  }

  // Hard Demon or standard
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`filter drop-shadow-[0_0_4px_rgba(234,88,12,0.4)] ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="44" fill="#1C1917" stroke="#EA580C" strokeWidth="3" />
      <circle cx="50" cy="50" r="30" fill="#EA580C" />
      <circle cx="36" cy="46" r="5" fill="#000000" />
      <circle cx="64" cy="46" r="5" fill="#000000" />
      <path d="M 34 66 Q 50 76 66 66" stroke="#431407" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
};

export const GDStarIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#FBBF24" className={className}>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

export const GDManaOrbIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <circle cx="12" cy="12" r="10" fill="#06B6D4" />
    <circle cx="12" cy="12" r="6" fill="#67E8F9" />
    <circle cx="10" cy="10" r="2.5" fill="#FFFFFF" />
  </svg>
);

export const GDDiamondIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <polygon points="12,2 22,9 12,22 2,9" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
    <polygon points="12,6 18,10 12,18 6,10" fill="#BAE6FD" />
  </svg>
);
