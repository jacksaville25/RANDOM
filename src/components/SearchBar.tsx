import React from 'react';
import { Search, X, Filter, ArrowUpDown } from 'lucide-react';
import { FilterState, ListTier } from '../types';
import { audio } from '../utils/audio';

interface SearchBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalMatches: number;
  totalListCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  filters,
  setFilters,
  totalMatches,
  totalListCount
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleTierSelect = (tier: ListTier) => {
    audio.playClick();
    if (tier === 'top10') {
      setFilters(prev => ({ ...prev, tier, minRank: 1, maxRank: 10 }));
    } else if (tier === 'main') {
      setFilters(prev => ({ ...prev, tier, minRank: 1, maxRank: 75 }));
    } else if (tier === 'extended') {
      setFilters(prev => ({ ...prev, tier, minRank: 76, maxRank: 150 }));
    } else if (tier === 'legacy') {
      setFilters(prev => ({ ...prev, tier, minRank: 151, maxRank: 1500 }));
    } else {
      setFilters(prev => ({ ...prev, tier: 'all', minRank: 1, maxRank: 1500 }));
    }
  };

  const handleReset = () => {
    audio.playClick();
    setFilters({
      search: '',
      tier: 'all',
      minRank: 1,
      maxRank: 1500,
      difficulty: 'all',
      sortBy: 'rank-asc',
      onlyTracked: false,
      onlyCompleted: false
    });
  };

  return (
    <div className="bg-[#0e0e12] border border-white/5 p-4 sm:p-6 shadow-2xl">
      
      {/* Editorial Standings Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 pb-3 border-b border-white/5">
        <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-emerald-400 uppercase">
          Current Standings — Top 1500
        </span>
        <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono tracking-widest uppercase">
          <span>MATCHES: <strong className="text-emerald-400">{totalMatches.toLocaleString()}</strong></span>
          <span>ROSTER: {totalListCount.toLocaleString()}</span>
        </div>
      </div>

      {/* Primary Search Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        
        {/* Search Input Box */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="SEARCH LEVELS BY NAME, CREATOR, SONG, OR ID..."
            className="w-full bg-black/50 border border-emerald-500/30 rounded-none px-4 py-2.5 text-xs font-mono tracking-widest text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition-colors uppercase"
          />
          {filters.search ? (
            <button
              onClick={() => {
                audio.playClick();
                setFilters(prev => ({ ...prev, search: '' }));
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none text-emerald-400">
              <Search className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={filters.sortBy}
              onChange={(e) => {
                audio.playClick();
                setFilters(prev => ({ ...prev, sortBy: e.target.value as any }));
              }}
              className="w-full appearance-none pl-3 pr-8 py-2.5 bg-black/50 border border-white/10 rounded-none text-slate-200 text-xs font-mono tracking-wider focus:outline-none focus:border-emerald-400 cursor-pointer uppercase"
            >
              <option value="rank-asc">SORT: RANK (1 → 1500)</option>
              <option value="rank-desc">SORT: RANK (1500 → 1)</option>
              <option value="points">SORT: POINTS (HIGH → LOW)</option>
              <option value="name">SORT: NAME (A → Z)</option>
              <option value="difficulty">SORT: DIFFICULTY</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Advanced Filter Toggle Button */}
          <button
            onClick={() => {
              audio.playClick();
              setShowAdvanced(!showAdvanced);
            }}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-none border text-xs font-mono font-bold tracking-wider uppercase transition-all ${
              showAdvanced || filters.tier !== 'all' || filters.onlyTracked || filters.onlyCompleted || filters.difficulty !== 'all'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-black/50 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Tier Quick Filter Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-white/5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mr-1">TIERS:</span>
          
          <button
            onClick={() => handleTierSelect('all')}
            className={`px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase transition-all ${
              filters.tier === 'all' && filters.minRank === 1 && filters.maxRank === 1500
                ? 'bg-emerald-400 text-black'
                : 'bg-[#14141a] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            ALL #1-1500
          </button>

          <button
            onClick={() => handleTierSelect('top10')}
            className={`px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase transition-all ${
              filters.tier === 'top10'
                ? 'bg-emerald-400 text-black font-black'
                : 'bg-[#14141a] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            TOP 10
          </button>

          <button
            onClick={() => handleTierSelect('main')}
            className={`px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase transition-all ${
              filters.tier === 'main'
                ? 'bg-emerald-400 text-black font-black'
                : 'bg-[#14141a] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            MAIN (1-75)
          </button>

          <button
            onClick={() => handleTierSelect('extended')}
            className={`px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase transition-all ${
              filters.tier === 'extended'
                ? 'bg-emerald-400 text-black font-black'
                : 'bg-[#14141a] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            EXTENDED (76-150)
          </button>

          <button
            onClick={() => handleTierSelect('legacy')}
            className={`px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase transition-all ${
              filters.tier === 'legacy'
                ? 'bg-emerald-400 text-black font-black'
                : 'bg-[#14141a] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            LEGACY (151-1500)
          </button>
        </div>

        {/* Reset Filter Action */}
        {(filters.search || filters.tier !== 'all' || filters.onlyTracked || filters.onlyCompleted || filters.difficulty !== 'all') && (
          <button
            onClick={handleReset}
            className="text-[10px] font-mono tracking-widest text-emerald-400 hover:text-emerald-300 uppercase underline"
          >
            [ RESET FILTERS ]
          </button>
        )}
      </div>

      {/* Advanced Filter Drawer */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono animate-in fade-in duration-150">
          
          {/* Rank Range */}
          <div>
            <label className="block text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1.5">
              Rank Bounds (#{filters.minRank} - #{filters.maxRank})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={filters.maxRank}
                value={filters.minRank}
                onChange={(e) => setFilters(prev => ({ ...prev, minRank: Math.max(1, parseInt(e.target.value) || 1) }))}
                className="w-20 px-2 py-1.5 bg-black border border-white/10 text-slate-200 text-center font-mono rounded-none"
              />
              <span className="text-slate-600">—</span>
              <input
                type="number"
                min={filters.minRank}
                max="1500"
                value={filters.maxRank}
                onChange={(e) => setFilters(prev => ({ ...prev, maxRank: Math.min(1500, parseInt(e.target.value) || 1500) }))}
                className="w-20 px-2 py-1.5 bg-black border border-white/10 text-slate-200 text-center font-mono rounded-none"
              />
            </div>
          </div>

          {/* Difficulty Tier */}
          <div>
            <label className="block text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1.5">Difficulty Tier</label>
            <select
              value={filters.difficulty}
              onChange={(e) => {
                audio.playClick();
                setFilters(prev => ({ ...prev, difficulty: e.target.value }));
              }}
              className="w-full px-2.5 py-1.5 bg-black border border-white/10 text-slate-200 focus:outline-none rounded-none text-xs uppercase"
            >
              <option value="all">ALL DIFFICULTIES</option>
              <option value="top_10">TOP 10 EXTREME</option>
              <option value="extreme">EXTREME DEMON</option>
              <option value="insane">INSANE DEMON</option>
              <option value="hard">HARD DEMON</option>
            </select>
          </div>

          {/* User Progress Filter Toggles */}
          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.onlyTracked}
                onChange={(e) => {
                  audio.playClick();
                  setFilters(prev => ({ ...prev, onlyTracked: e.target.checked }));
                }}
                className="w-3.5 h-3.5 rounded-none bg-black border-white/20 text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">Only Logged Demons</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.onlyCompleted}
                onChange={(e) => {
                  audio.playClick();
                  setFilters(prev => ({ ...prev, onlyCompleted: e.target.checked }));
                }}
                className="w-3.5 h-3.5 rounded-none bg-black border-white/20 text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">Only 100% Completed</span>
            </label>
          </div>

        </div>
      )}
    </div>
  );
};
