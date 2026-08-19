import React from 'react';
import { Play, PlusCircle, CheckCircle, ExternalLink, Sparkles, Zap, Trophy, Shield } from 'lucide-react';
import { DemonLevel, UserRun } from '../types';
import { getTierForRank } from '../data/demonList';
import { DemonFace, GDStarIcon } from './GDIcons';
import { audio } from '../utils/audio';

interface DemonCardProps {
  demon: DemonLevel;
  userRuns: UserRun[];
  onSelectDemon: (demon: DemonLevel) => void;
  onAddRun: (demon: DemonLevel) => void;
  onPractice: (demon: DemonLevel) => void;
}

export const DemonCard: React.FC<DemonCardProps> = ({
  demon,
  userRuns,
  onSelectDemon,
  onAddRun,
  onPractice
}) => {
  const tier = getTierForRank(demon.rank);

  // Find user's best run on this level
  const levelRuns = userRuns.filter(r => r.levelRank === demon.rank);
  const bestRun = levelRuns.reduce((best: UserRun | null, cur: UserRun) => {
    if (!best || cur.percentage > best.percentage) return cur;
    return best;
  }, null as UserRun | null);

  const totalAttempts = levelRuns.reduce((sum, r) => sum + (r.attempts || 0), 0);

  // Format rank as 2-digit minimum (e.g. 01, 02)
  const formattedRank = demon.rank < 10 ? `0${demon.rank}` : `${demon.rank}`;

  const isTopRank = demon.rank <= 10;
  const isMainList = demon.rank <= 75;

  return (
    <div
      className={`group relative flex flex-col justify-between p-4 sm:p-5 transition-all cursor-pointer border-l-4 ${
        bestRun && bestRun.percentage >= 100
          ? 'bg-[#121815] border-l-emerald-400 hover:bg-[#16201b]'
          : isTopRank
          ? 'bg-white/5 border-l-emerald-400 hover:bg-white/10'
          : isMainList
          ? 'bg-[#14141a] border-l-emerald-500/60 hover:bg-white/5'
          : 'bg-[#14141a] border-l-slate-700 hover:bg-white/5'
      } border-t border-r border-b border-white/5`}
      onClick={() => {
        audio.playClick();
        onSelectDemon(demon);
      }}
    >
      
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Big Editorial Italic Rank Numeral */}
          <span className={`text-2xl sm:text-3xl font-black italic font-mono ${
            isTopRank ? 'text-emerald-400' : isMainList ? 'text-emerald-400/80' : 'text-slate-500'
          }`}>
            {formattedRank}
          </span>
          
          <div className="p-1 bg-black/40 border border-white/5">
            <DemonFace difficulty={demon.difficulty} size={24} />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight uppercase text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
              {demon.name}
            </h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
              {demon.creator} • <span className="text-slate-300 font-bold">{demon.points100} PTS</span>
            </p>
          </div>
        </div>

        {/* Verifier Badge (Editorial Verifier Box) */}
        <div className="text-right">
          <div className="text-[9px] text-slate-500 uppercase font-mono tracking-wider">Verifier</div>
          <div className="text-xs font-bold font-mono text-emerald-300 tracking-wider truncate max-w-[90px]">
            {demon.verifier ? demon.verifier.toUpperCase() : demon.creator.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Center Details & Song */}
      <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span className="truncate max-w-[170px]">
          ♫ {demon.songName}
        </span>
        <span className="text-[10px] text-slate-500">
          ID: {demon.levelId}
        </span>
      </div>

      {/* User Progress Bar if tracked */}
      {bestRun && (
        <div className="mt-3 pt-2.5 border-t border-white/5">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase mb-1">
            <span className="text-slate-400">
              {bestRun.percentage >= 100 ? (
                <span className="text-emerald-400 font-black tracking-wider flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 inline" /> 100% GG COMPLETE
                </span>
              ) : (
                <span className="text-amber-400 font-bold">
                  BEST: {bestRun.percentage}% ({totalAttempts.toLocaleString()} ATTEMPTS)
                </span>
              )}
            </span>
            <span className="text-emerald-400 font-bold font-mono">
              +{bestRun.earnedPoints} PTS
            </span>
          </div>

          <div className="w-full bg-black h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                bestRun.percentage >= 100 ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
              style={{ width: `${Math.min(100, bestRun.percentage)}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom Actions Bar */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audio.playClick();
              onPractice(demon);
            }}
            className="px-2.5 py-1 bg-black/60 hover:bg-emerald-950/40 border border-white/10 hover:border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold tracking-wider uppercase transition-all"
            title="Open Practice Mode Grinder"
          >
            PRACTICE
          </button>
        </div>

        <button
          onClick={() => {
            audio.playClick();
            onAddRun(demon);
          }}
          className="flex items-center gap-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-mono font-black tracking-widest uppercase transition-all shadow-sm active:scale-95"
        >
          <PlusCircle className="w-3 h-3" />
          <span>+ LOG RUN</span>
        </button>
      </div>

    </div>
  );
};
