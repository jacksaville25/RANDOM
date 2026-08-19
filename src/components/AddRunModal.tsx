import React from 'react';
import confetti from 'canvas-confetti';
import { X, Trophy, CheckCircle, Percent, ExternalLink, Calendar, Shield, Hash, Play, Sparkles } from 'lucide-react';
import { DemonLevel, RefreshRate, UserRun } from '../types';
import { ALL_DEMONS, calculateProgressPoints, getTierForRank } from '../data/demonList';
import { DemonFace, GDStarIcon } from './GDIcons';
import { audio } from '../utils/audio';

interface AddRunModalProps {
  initialDemon?: DemonLevel | null;
  onClose: () => void;
  onSaveRun: (demon: DemonLevel, runData: any) => void;
}

export const AddRunModal: React.FC<AddRunModalProps> = ({
  initialDemon,
  onClose,
  onSaveRun
}) => {
  const [selectedRank, setSelectedRank] = React.useState<number>(initialDemon?.rank || 1);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [startPercent, setStartPercent] = React.useState(0);
  const [endPercent, setEndPercent] = React.useState(100);
  const [attempts, setAttempts] = React.useState(100);
  const [refreshRate, setRefreshRate] = React.useState<RefreshRate>('240Hz');
  const [videoProofUrl, setVideoProofUrl] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);

  const selectedDemon = ALL_DEMONS.find(d => d.rank === selectedRank) || ALL_DEMONS[0];
  const tier = getTierForRank(selectedDemon.rank);
  const pointsEarned = calculateProgressPoints(selectedDemon.rank, endPercent, selectedDemon.minPercent);

  // Search filtered demons for dropdown
  const filteredDemons = React.useMemo(() => {
    if (!searchQuery) return ALL_DEMONS.slice(0, 50);
    const q = searchQuery.toLowerCase();
    return ALL_DEMONS.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.rank.toString() === q ||
      d.creator.toLowerCase().includes(q)
    ).slice(0, 50);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (endPercent >= 100) {
      audio.playCompleteFanfare();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } else {
      audio.playProgressDing();
    }

    onSaveRun(selectedDemon, {
      startPercent,
      endPercent,
      attempts: Math.max(1, attempts),
      refreshRate,
      videoProofUrl,
      notes,
      date,
      status: endPercent >= 100 ? 'completed' : 'progress'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] bg-[#0c0c10] border border-white/10 shadow-2xl overflow-hidden flex flex-col font-mono">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0e0e12]">
          <div>
            <h2 className="text-xs font-black tracking-[0.4em] text-emerald-400 uppercase">
              LOG NEW RUN
            </h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
              Verified Pointercrate Scale Submission
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar text-xs">
          
          {/* Level Selection with Quick Search */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
              Level Selection ({selectedDemon.name} - #{selectedDemon.rank})
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="TYPE TO FILTER DEMONS (#1 TO #1500)..."
                className="w-full bg-black border border-white/10 p-3 text-xs text-slate-200 uppercase focus:border-emerald-400 focus:outline-none"
              />
              <select
                value={selectedRank}
                onChange={(e) => {
                  audio.playClick();
                  setSelectedRank(parseInt(e.target.value) || 1);
                }}
                className="w-full bg-black border border-white/10 p-3 text-xs text-slate-200 uppercase focus:border-emerald-400 focus:outline-none"
              >
                {filteredDemons.map(d => (
                  <option key={d.rank} value={d.rank}>
                    #{d.rank} - {d.name} (by {d.creator}) • {d.points100} pts
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Demon Live Card */}
          <div className="p-3.5 bg-black border-l-4 border-l-emerald-400 border-t border-r border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl font-black italic text-emerald-400">
                {selectedDemon.rank < 10 ? `0${selectedDemon.rank}` : selectedDemon.rank}
              </span>
              <DemonFace difficulty={selectedDemon.difficulty} size={24} />
              <div>
                <h4 className="text-sm font-bold text-slate-100 uppercase">{selectedDemon.name}</h4>
                <p className="text-[10px] text-slate-500 uppercase">
                  by {selectedDemon.creator} • Verifier: {selectedDemon.verifier || selectedDemon.creator}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-black text-emerald-400">+{pointsEarned} PTS</div>
              <div className="text-[9px] text-slate-500 uppercase">Qualifies: ≥{selectedDemon.minPercent}%</div>
            </div>
          </div>

          {/* Percentages: Start and End */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Start %</label>
              <input
                type="number"
                min="0"
                max={endPercent}
                value={startPercent}
                onChange={(e) => setStartPercent(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-black border border-white/10 p-3 text-xs text-slate-100 font-bold focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">End %</label>
              <input
                type="number"
                min={startPercent}
                max="100"
                value={endPercent}
                onChange={(e) => setEndPercent(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full bg-black border border-white/10 p-3 text-xs text-emerald-400 font-bold focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Attempts Count & Quick Add Buttons */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                Total Attempts Logged
              </label>
              <div className="flex items-center gap-1">
                {[+10, +50, +100, +500, +1000].map(amt => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => {
                      audio.playClick();
                      setAttempts(prev => prev + amt);
                    }}
                    className="px-1.5 py-0.5 bg-black border border-white/10 text-[9px] text-emerald-400 hover:bg-white/5"
                  >
                    +{amt}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="number"
              min="1"
              value={attempts}
              onChange={(e) => setAttempts(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-black border border-white/10 p-3 text-xs text-slate-100 font-bold focus:border-emerald-400 focus:outline-none"
            />
          </div>

          {/* Refresh Rate & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Refresh Rate / CBF</label>
              <select
                value={refreshRate}
                onChange={(e) => setRefreshRate(e.target.value as RefreshRate)}
                className="w-full bg-black border border-white/10 p-3 text-xs text-slate-200 uppercase focus:border-emerald-400 focus:outline-none"
              >
                <option value="60Hz">60Hz</option>
                <option value="120Hz">120Hz</option>
                <option value="144Hz">144Hz</option>
                <option value="240Hz">240Hz</option>
                <option value="360Hz">360Hz</option>
                <option value="Physics Bypass / CBF">Click Between Frames (CBF)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Date Achieved</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-black border border-white/10 p-3 text-xs text-slate-200 focus:border-emerald-400 focus:outline-none uppercase"
              />
            </div>
          </div>

          {/* Video Proof URL */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Video Proof URL (Optional)</label>
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={videoProofUrl}
              onChange={(e) => setVideoProofUrl(e.target.value)}
              className="w-full bg-black border border-white/10 p-3 text-xs text-slate-200 focus:border-emerald-400 focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Session Notes / Flukes</label>
            <input
              type="text"
              placeholder="e.g. Fluked from 42% wave drop..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-black border border-white/10 p-3 text-xs text-slate-200 focus:border-emerald-400 focus:outline-none uppercase"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black uppercase tracking-[0.2em] py-4 transition-all mt-4 cursor-pointer"
          >
            {endPercent >= 100 ? 'SUBMIT 100% VICTORY GG' : 'SUBMIT RUN RECORD'}
          </button>

        </form>

      </div>
    </div>
  );
};
