import React from 'react';
import confetti from 'canvas-confetti';
import { X, Play, Pause, RotateCcw, Plus, Trophy, Flame, CheckCircle, Search, Clock, Zap, Flag } from 'lucide-react';
import { DemonLevel, RefreshRate, UserRun } from '../types';
import { ALL_DEMONS, calculateProgressPoints } from '../data/demonList';
import { DemonFace, GDStarIcon } from './GDIcons';
import { audio } from '../utils/audio';

interface PracticeGrinderModalProps {
  initialDemon?: DemonLevel | null;
  onClose: () => void;
  onSaveRun: (demon: DemonLevel, runData: any) => void;
}

export const PracticeGrinderModal: React.FC<PracticeGrinderModalProps> = ({
  initialDemon,
  onClose,
  onSaveRun
}) => {
  const [selectedDemon, setSelectedDemon] = React.useState<DemonLevel | null>(initialDemon || ALL_DEMONS[0]);
  const [attempts, setAttempts] = React.useState(0);
  const [sessionSeconds, setSessionSeconds] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [bestPercent, setBestPercent] = React.useState(0);
  const [startPercent, setStartPercent] = React.useState(0);
  const [endPercent, setEndPercent] = React.useState(100);
  const [milestones, setMilestones] = React.useState<string[]>([]);
  const [quickPercentInput, setQuickPercentInput] = React.useState(50);

  // Timer loop
  React.useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Spacebar hotkey to add attempts while focused
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement)?.tagName !== 'INPUT' && (e.target as HTMLElement)?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleAddAttempt(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddAttempt = (amt: number = 1) => {
    audio.playClick();
    setAttempts(prev => prev + amt);
    if (!isRunning) setIsRunning(true);
  };

  const handleRecordMilestone = (percent: number) => {
    audio.playCheckpoint();
    setBestPercent(prev => Math.max(prev, percent));
    const timeStr = formatTime(sessionSeconds);
    setMilestones(prev => [`${percent}% @ #${attempts} (${timeStr})`, ...prev.slice(0, 7)]);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSaveAsRun = () => {
    if (!selectedDemon) return;
    const finalPercent = bestPercent > 0 ? bestPercent : endPercent;

    if (finalPercent >= 100) {
      audio.playCompleteFanfare();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      audio.playProgressDing();
    }

    onSaveRun(selectedDemon, {
      startPercent: startPercent,
      endPercent: finalPercent,
      attempts: Math.max(1, attempts),
      refreshRate: '240Hz',
      notes: `Grinder Session: ${attempts} attempts in ${formatTime(sessionSeconds)}. Milestones: ${milestones.slice(0, 2).join(', ')}`,
      status: finalPercent >= 100 ? 'completed' : 'progress'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0c0c10] border border-white/10 shadow-2xl overflow-hidden flex flex-col font-mono">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0e0e12]">
          <div>
            <h2 className="text-xs font-black tracking-[0.4em] text-emerald-400 uppercase">
              PRACTICE MODE & ATTEMPT GRINDER
            </h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
              Live Session Stopwatch • Spacebar Hotkey Enabled
            </p>
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar text-xs">
          
          {/* Level Switcher */}
          <div className="p-3 bg-black border-l-4 border-l-emerald-400 border-t border-r border-b border-white/5 flex items-center justify-between">
            {selectedDemon ? (
              <div className="flex items-center gap-3">
                <span className="text-lg font-black italic text-emerald-400">
                  #{selectedDemon.rank}
                </span>
                <DemonFace difficulty={selectedDemon.difficulty} size={24} />
                <div>
                  <h3 className="text-sm font-bold text-slate-100 uppercase">{selectedDemon.name}</h3>
                  <p className="text-[10px] text-slate-500 uppercase">by {selectedDemon.creator} • {selectedDemon.points100} PTS</p>
                </div>
              </div>
            ) : null}

            <button
              onClick={() => {
                audio.playClick();
                const nextIdx = (selectedDemon ? selectedDemon.rank % 50 : 0);
                setSelectedDemon(ALL_DEMONS[nextIdx]);
              }}
              className="text-[10px] px-3 py-1.5 bg-white/5 hover:bg-white/10 text-emerald-400 border border-white/10 font-bold uppercase tracking-wider"
            >
              SWITCH LEVEL
            </button>
          </div>

          {/* Grinder Big Attempt Clicker Box */}
          <div className="text-center py-6 px-4 bg-[#14141a] border border-white/5 relative">
            <div className="absolute top-3 right-4 flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(sessionSeconds)}</span>
              <button
                onClick={() => {
                  audio.playClick();
                  setIsRunning(!isRunning);
                }}
                className="p-1 bg-black border border-white/10 text-slate-300 hover:text-white"
              >
                {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>

            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] block mb-1">
              CURRENT SESSION ATTEMPTS
            </span>

            {/* Giant Number Display */}
            <div className="text-5xl sm:text-6xl font-black italic text-emerald-400 tracking-tight my-2">
              {attempts.toLocaleString()}
            </div>

            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">
              [ PRESS <kbd className="px-1.5 py-0.5 bg-black text-emerald-300 border border-white/10 text-[9px]">SPACEBAR</kbd> OR CLICK BELOW TO LOG ]
            </p>

            {/* Clicker Button */}
            <button
              onClick={() => handleAddAttempt(1)}
              className="w-full sm:w-3/4 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-[0.2em] transition-all cursor-pointer mb-3"
            >
              +1 ATTEMPT (CLICK / TAP)
            </button>

            {/* Quick Batch Increment Buttons */}
            <div className="flex items-center justify-center gap-2">
              {[+5, +10, +25, +50, +100].map(amt => (
                <button
                  key={amt}
                  onClick={() => handleAddAttempt(amt)}
                  className="px-2.5 py-1 bg-black hover:bg-white/10 border border-white/10 text-emerald-300 text-[10px] font-bold"
                >
                  +{amt}
                </button>
              ))}
              <button
                onClick={() => {
                  audio.playClick();
                  setAttempts(0);
                  setSessionSeconds(0);
                }}
                className="p-1.5 bg-black hover:bg-white/10 border border-white/10 text-slate-500 hover:text-red-400"
                title="Reset Session"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Milestone Quick Logger */}
          <div className="p-4 bg-black border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Flag className="w-3 h-3 text-emerald-400" />
                <span>Log Milestone Percentage</span>
              </label>
              {bestPercent > 0 && (
                <span className="text-[10px] font-bold text-emerald-400">
                  SESSION PB: {bestPercent}%
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="100"
                value={quickPercentInput}
                onChange={(e) => setQuickPercentInput(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-20 px-3 py-2 bg-[#14141a] border border-white/10 text-slate-100 font-mono font-bold text-center"
              />
              <span className="text-slate-500 text-xs font-bold">%</span>

              <button
                onClick={() => handleRecordMilestone(quickPercentInput)}
                className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-[10px] uppercase tracking-wider transition-all"
              >
                LOG {quickPercentInput}% MILESTONE
              </button>

              <button
                onClick={() => handleRecordMilestone(100)}
                className="py-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] uppercase tracking-wider"
              >
                100% GG!
              </button>
            </div>

            {/* Recent Milestones List */}
            {milestones.length > 0 && (
              <div className="pt-2 border-t border-white/5">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  Session Log History
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {milestones.map((m, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-[#14141a] border border-white/5 text-[10px] text-slate-300">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action to Save as Permanent Run */}
          <button
            onClick={handleSaveAsRun}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>SAVE & TRANSFER SESSION TO PROFILE RUN ({attempts} ATTEMPTS)</span>
          </button>

        </div>
      </div>
    </div>
  );
};
