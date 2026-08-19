import React from 'react';
import { SlidersHorizontal, Trophy, Award, Flame, Info, CheckCircle } from 'lucide-react';
import { ALL_DEMONS, calculateListPoints, calculateProgressPoints, getTierForRank } from '../data/demonList';
import { DemonFace, GDStarIcon } from './GDIcons';
import { audio } from '../utils/audio';

export const PointsCalculatorView: React.FC = () => {
  const [calcRank, setCalcRank] = React.useState<number>(1);
  const [calcPercent, setCalcPercent] = React.useState<number>(100);

  const currentDemon = ALL_DEMONS.find(d => d.rank === calcRank) || ALL_DEMONS[0];
  const tier = getTierForRank(calcRank);
  const fullPoints = calculateListPoints(calcRank);
  const progressPoints = calculateProgressPoints(calcRank, calcPercent, currentDemon.minPercent);

  const sampleRanks = [1, 5, 10, 25, 50, 75, 100, 150, 250, 500, 1000, 1500];

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-mono">
      
      {/* Overview Intro Card */}
      <div className="p-6 bg-[#0e0e12] border border-white/5 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black tracking-[0.2em] text-emerald-400 uppercase">
              POINTERCRATE POINTS & RANKING CALCULATOR
            </h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
              Simulate point distributions, progress thresholds, and qualifying scores across #1-1500
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Simulator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Sliders Box */}
        <div className="md:col-span-2 p-6 bg-[#0e0e12] border border-white/5 space-y-6">
          
          {/* Rank Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Level Placement / Rank
              </label>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase">
                #{calcRank} • {tier.label}
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="1500"
              value={calcRank}
              onChange={(e) => {
                setCalcRank(parseInt(e.target.value) || 1);
              }}
              className="w-full accent-emerald-400 h-1.5 bg-black rounded-none cursor-pointer"
            />

            <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1 uppercase">
              <span>#1 (TIDAL WAVE)</span>
              <span>#75 (MAIN)</span>
              <span>#150 (EXTENDED)</span>
              <span>#1500 (LEGACY)</span>
            </div>

            {/* Quick Rank Jump Pills */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {[1, 5, 10, 25, 50, 75, 100, 150, 500, 1000, 1500].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    audio.playClick();
                    setCalcRank(r);
                  }}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase transition-all ${
                    calcRank === r
                      ? 'bg-emerald-400 text-black'
                      : 'bg-black text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  #{r}
                </button>
              ))}
            </div>
          </div>

          {/* Percentage Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Progress Percentage
              </label>
              <span className="text-sm font-bold text-emerald-400">
                {calcPercent}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={calcPercent}
              onChange={(e) => setCalcPercent(parseInt(e.target.value) || 0)}
              className="w-full accent-emerald-400 h-1.5 bg-black rounded-none cursor-pointer"
            />

            <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1 uppercase">
              <span>0% (START)</span>
              <span>{currentDemon.minPercent}% (QUALIFICATION MIN)</span>
              <span>100% (FULL GG)</span>
            </div>
          </div>

          {/* Level Preview */}
          <div className="p-3.5 bg-black border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-black italic text-emerald-400">#{currentDemon.rank}</span>
              <DemonFace difficulty={currentDemon.difficulty} size={24} />
              <div>
                <h4 className="text-xs font-bold text-slate-100 uppercase">{currentDemon.name}</h4>
                <p className="text-[9px] text-slate-500 uppercase">by {currentDemon.creator} • {currentDemon.songName}</p>
              </div>
            </div>

            <span className="text-[10px] text-slate-400">
              Min: {currentDemon.minPercent}%
            </span>
          </div>

        </div>

        {/* Live Calculation Output Card */}
        <div className="p-6 bg-[#0c0c10] border border-white/10 shadow-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] block mb-2">
              // CALCULATED YIELD
            </span>

            <div className="text-4xl sm:text-5xl font-black italic text-emerald-400 tracking-tight my-2">
              {progressPoints} <span className="text-sm font-normal text-slate-500 font-mono">PTS</span>
            </div>

            <p className="text-[10px] text-slate-500 uppercase mt-1">
              For achieving <strong className="text-slate-200">{calcPercent}%</strong> on <strong className="text-slate-200">#{calcRank} {currentDemon.name}</strong>
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/5 text-[10px] uppercase">
            <div className="flex items-center justify-between text-slate-500">
              <span>100% Value:</span>
              <strong className="text-slate-200">{fullPoints} PTS</strong>
            </div>

            <div className="flex items-center justify-between text-slate-500">
              <span>List Tier:</span>
              <strong className="text-emerald-400">{tier.label}</strong>
            </div>

            <div className="flex items-center justify-between text-slate-500">
              <span>Qualification:</span>
              <strong className={calcPercent >= 100 ? 'text-emerald-400' : calcPercent >= currentDemon.minPercent ? 'text-amber-400' : 'text-slate-600'}>
                {calcPercent >= 100 ? '100% (FULL)' : calcPercent >= currentDemon.minPercent ? 'QUALIFIED' : 'BELOW MIN'}
              </strong>
            </div>
          </div>
        </div>

      </div>

      {/* Point Distribution Table */}
      <div className="p-6 bg-[#0e0e12] border border-white/5 shadow-xl">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
          Point Scale Reference Grid (#1 - #1500)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {sampleRanks.map(r => {
            const pts = calculateListPoints(r);
            const d = ALL_DEMONS.find(item => item.rank === r);
            return (
              <div
                key={r}
                onClick={() => {
                  audio.playClick();
                  setCalcRank(r);
                }}
                className={`p-3 border transition-all cursor-pointer ${
                  calcRank === r
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-black border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="text-emerald-400">#{r}</span>
                  <span className="text-slate-300">{pts} PTS</span>
                </div>
                <div className="text-[10px] text-slate-500 uppercase truncate">
                  {d ? d.name : `Demon #${r}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
