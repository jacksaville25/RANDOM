import React from 'react';
import { X, Play, PlusCircle, CheckCircle, ExternalLink, Copy, Check, Trophy, Shield, Hash, Music, UserCheck, Flame, Zap } from 'lucide-react';
import { DemonLevel, UserRun } from '../types';
import { getTierForRank } from '../data/demonList';
import { DemonFace, GDStarIcon } from './GDIcons';
import { audio } from '../utils/audio';

interface LevelDetailModalProps {
  demon: DemonLevel;
  onClose: () => void;
  userRuns: UserRun[];
  onAddRun: (demon: DemonLevel) => void;
  onPractice: (demon: DemonLevel) => void;
  onDeleteRun: (runId: string) => void;
}

export const LevelDetailModal: React.FC<LevelDetailModalProps> = ({
  demon,
  onClose,
  userRuns,
  onAddRun,
  onPractice,
  onDeleteRun
}) => {
  const [copiedId, setCopiedId] = React.useState(false);

  const tier = getTierForRank(demon.rank);
  const demonRuns = userRuns.filter(r => r.levelRank === demon.rank);
  const bestRun = demonRuns.reduce((best: UserRun | null, cur: UserRun) => {
    if (!best || cur.percentage > best.percentage) return cur;
    return best;
  }, null as UserRun | null);

  const handleCopyId = () => {
    audio.playCheckpoint();
    navigator.clipboard.writeText(demon.levelId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const formattedRank = demon.rank < 10 ? `0${demon.rank}` : `${demon.rank}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0c0c10] border border-white/10 shadow-2xl overflow-hidden flex flex-col font-mono">
        
        {/* Top Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0e0e12]">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl font-black italic text-emerald-400">
              #{formattedRank}
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-slate-100">
                {demon.name}
              </h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                by {demon.creator} • Verifier: {demon.verifier || demon.creator}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="p-1.5 bg-black border border-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar text-xs">
          
          {/* Main Info Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-[#14141a] border border-white/5">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block">Placement</span>
              <span className="text-base font-black text-emerald-400">#{demon.rank}</span>
            </div>

            <div className="p-3 bg-[#14141a] border border-white/5">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block">Points Yield</span>
              <span className="text-base font-black text-emerald-400">{demon.points100} PTS</span>
            </div>

            <div className="p-3 bg-[#14141a] border border-white/5">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block">Min Progress</span>
              <span className="text-base font-black text-slate-200">{demon.minPercent}%</span>
            </div>

            <div className="p-3 bg-[#14141a] border border-white/5">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block">Objects</span>
              <span className="text-base font-bold text-slate-200 font-mono">{demon.objectCount.toLocaleString()}</span>
            </div>
          </div>

          {/* Song & Level ID Bar */}
          <div className="p-3.5 bg-black border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-slate-300">
              <Music className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="truncate">
                {demon.songName} — <span className="text-slate-500">{demon.songArtist}</span>
              </span>
            </div>

            <button
              onClick={handleCopyId}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-300 text-[10px] font-bold uppercase transition-all"
            >
              {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>ID: {demon.levelId}</span>
            </button>
          </div>

          {/* Description */}
          {demon.description && (
            <div className="p-4 bg-[#14141a] border border-white/5">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                Level History & Overview
              </span>
              <p className="text-slate-300 leading-relaxed text-xs">
                {demon.description}
              </p>
            </div>
          )}

          {/* Your Progress History on this Demon */}
          <div className="p-4 bg-black border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                Your Logged Runs on {demon.name}
              </span>
              {bestRun && (
                <span className={`text-[10px] font-bold uppercase ${
                  bestRun.percentage >= 100 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  BEST: {bestRun.percentage}% (+{bestRun.earnedPoints} PTS)
                </span>
              )}
            </div>

            {demonRuns.length > 0 ? (
              <div className="space-y-2">
                {demonRuns.map(r => (
                  <div key={r.id} className="p-3 bg-[#14141a] border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                          r.percentage >= 100
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}>
                          {r.startPercent > 0 ? `${r.startPercent}-${r.endPercent}%` : `${r.percentage}%`}
                        </span>
                        <span className="text-[10px] text-slate-400">{r.attempts.toLocaleString()} attempts ({r.refreshRate})</span>
                      </div>
                      {r.notes && <p className="text-[10px] text-slate-500 mt-1 italic">{r.notes}</p>}
                    </div>

                    <button
                      onClick={() => {
                        audio.playClick();
                        onDeleteRun(r.id);
                      }}
                      className="text-[9px] text-slate-600 hover:text-red-400 uppercase tracking-wider underline"
                    >
                      [DELETE]
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-[10px] uppercase py-2">
                No runs logged yet for this demon.
              </p>
            )}
          </div>

          {/* Modal Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => onPractice(demon)}
              className="py-3.5 bg-black hover:bg-emerald-950/40 border border-white/10 hover:border-emerald-500/40 text-emerald-300 font-bold text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer"
            >
              LAUNCH PRACTICE GRINDER
            </button>

            <button
              onClick={() => onAddRun(demon)}
              className="py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer"
            >
              + LOG PROGRESS RUN
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
