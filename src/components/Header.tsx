import React from 'react';
import { Volume2, VolumeX, PlusCircle, Trophy, Flame, Play, SlidersHorizontal, Activity } from 'lucide-react';
import { audio } from '../utils/audio';

interface HeaderProps {
  activeTab: 'list' | 'tracker' | 'practice' | 'calculator';
  setActiveTab: (tab: 'list' | 'tracker' | 'practice' | 'calculator') => void;
  onOpenAddRun: () => void;
  onOpenPractice: () => void;
  userStats: {
    totalPoints: number;
    completedCount: number;
    distinctLevelsTracked: number;
    hardestBeatenName: string | null;
    hardestBeatenRank: number | null;
  };
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddRun,
  onOpenPractice,
  userStats,
  soundEnabled,
  setSoundEnabled
}) => {
  const handleToggleSound = () => {
    const next = audio.toggleSound();
    setSoundEnabled(next);
  };

  const handleTabChange = (tab: 'list' | 'tracker' | 'practice' | 'calculator') => {
    audio.playClick();
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0e0e12]/95 backdrop-blur-md border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Logo & Title (Editorial Header Pattern) */}
          <div className="flex items-baseline gap-3 cursor-pointer" onClick={() => handleTabChange('list')}>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter italic text-emerald-400 hover:text-emerald-300 transition-colors">
              DEMON LIST
            </h1>
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
              Ver. 2.5.14 // #1-1500
            </span>
          </div>

          {/* Quick Stats Pill (Editorial Monospace Counters) */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#14141a] border border-white/5 text-slate-300">
              <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Points:</span>
              <span className="font-mono font-bold text-emerald-400">{userStats.totalPoints} PTS</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#14141a] border border-white/5 text-slate-300">
              <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Beaten:</span>
              <span className="font-mono font-bold text-emerald-400">{userStats.completedCount} 100%</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2 border transition-all ${
                soundEnabled
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-black/40 border-white/5 text-slate-600 hover:text-slate-400'
              }`}
              title={soundEnabled ? 'Sound FX Enabled (Click to mute)' : 'Sound FX Muted (Click to enable)'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Editorial Sharp CTA Button */}
            <button
              onClick={() => {
                audio.playClick();
                onOpenAddRun();
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black uppercase tracking-[0.2em] py-2 px-4 transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log Run</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Editorial Monospace Nav) */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 overflow-x-auto gap-6 scrollbar-none">
          <nav className="flex items-center gap-6 text-[10px] font-mono font-bold tracking-[0.2em] uppercase">
            <button
              onClick={() => handleTabChange('list')}
              className={`pb-1 transition-colors cursor-pointer ${
                activeTab === 'list'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Top 1500 List
            </button>

            <button
              onClick={() => handleTabChange('tracker')}
              className={`pb-1 transition-colors cursor-pointer ${
                activeTab === 'tracker'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Progress ({userStats.distinctLevelsTracked})
            </button>

            <button
              onClick={() => handleTabChange('practice')}
              className={`pb-1 transition-colors cursor-pointer ${
                activeTab === 'practice'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Practice Grinder
            </button>

            <button
              onClick={() => handleTabChange('calculator')}
              className={`pb-1 transition-colors cursor-pointer ${
                activeTab === 'calculator'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Points Calculator
            </button>
          </nav>

          <div className="hidden lg:flex items-center gap-6 text-[10px] font-mono tracking-widest text-slate-500 uppercase">
            <span>Main (1-75)</span>
            <span>Extended (76-150)</span>
            <span>Legacy (151-1500)</span>
          </div>
        </div>

      </div>
    </header>
  );
};
