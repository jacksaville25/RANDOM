import React from 'react';
import { LayoutGrid, List, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Flame, SearchX } from 'lucide-react';
import { DemonLevel, UserRun } from '../types';
import { DemonCard } from './DemonCard';
import { DemonFace, GDStarIcon } from './GDIcons';
import { getTierForRank } from '../data/demonList';
import { audio } from '../utils/audio';

interface DemonGridProps {
  demons: DemonLevel[];
  userRuns: UserRun[];
  onSelectDemon: (demon: DemonLevel) => void;
  onAddRun: (demon: DemonLevel) => void;
  onPractice: (demon: DemonLevel) => void;
  onResetFilters: () => void;
}

export const DemonGrid: React.FC<DemonGridProps> = ({
  demons,
  userRuns,
  onSelectDemon,
  onAddRun,
  onPractice,
  onResetFilters
}) => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(24);

  // Reset page when list changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [demons.length]);

  const totalPages = Math.max(1, Math.ceil(demons.length / pageSize));
  const displayedDemons = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return demons.slice(start, start + pageSize);
  }, [demons, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    audio.playClick();
    setCurrentPage(Math.min(totalPages, Math.max(1, page)));
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4">
      
      {/* Top Toolbar: View Switcher & Page Size */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-[#0e0e12] border border-white/5 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider">VIEW:</span>
          <div className="flex items-center gap-1 bg-black/50 border border-white/10 p-0.5">
            <button
              onClick={() => {
                audio.playClick();
                setViewMode('grid');
              }}
              className={`p-1.5 transition-all ${
                viewMode === 'grid' ? 'bg-emerald-500 text-black' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                audio.playClick();
                setViewMode('table');
              }}
              className={`p-1.5 transition-all ${
                viewMode === 'table' ? 'bg-emerald-500 text-black' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Compact Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-slate-700">|</span>

          {/* Page size dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider">PER PAGE:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                audio.playClick();
                setPageSize(parseInt(e.target.value) || 24);
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-black border border-white/10 text-slate-200 text-xs font-mono focus:outline-none uppercase"
            >
              <option value="24">24</option>
              <option value="48">48</option>
              <option value="96">96</option>
              <option value="150">150</option>
            </select>
          </div>
        </div>

        {/* Page navigation controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1 font-mono">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-1.5 bg-black border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              title="First Page"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 bg-black border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-3 py-1 bg-black border border-white/10 text-[10px] font-bold text-emerald-400 tracking-wider">
              PAGE {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-black border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-black border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              title="Last Page"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Grid or Table Layout */}
      {displayedDemons.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {displayedDemons.map((demon) => (
              <DemonCard
                key={demon.rank}
                demon={demon}
                userRuns={userRuns}
                onSelectDemon={onSelectDemon}
                onAddRun={onAddRun}
                onPractice={onPractice}
              />
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-[#0e0e12] border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left font-mono">
                <thead className="text-slate-400 bg-black/60 uppercase font-bold text-[9px] tracking-widest border-b border-white/5">
                  <tr>
                    <th className="py-3 px-4">Rank & Demon</th>
                    <th className="py-3 px-3">Publisher</th>
                    <th className="py-3 px-3">Verifier</th>
                    <th className="py-3 px-3">Song</th>
                    <th className="py-3 px-3">Points</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {displayedDemons.map((demon) => {
                    const tier = getTierForRank(demon.rank);
                    const levelRuns = userRuns.filter(r => r.levelRank === demon.rank);
                    const bestRun = levelRuns.reduce((best: UserRun | null, cur: UserRun) => {
                      if (!best || cur.percentage > best.percentage) return cur;
                      return best;
                    }, null as UserRun | null);

                    const formattedRank = demon.rank < 10 ? `0${demon.rank}` : `${demon.rank}`;

                    return (
                      <tr
                        key={demon.rank}
                        className={`hover:bg-white/5 transition-colors border-l-4 ${
                          demon.rank <= 10
                            ? 'border-l-emerald-400 bg-white/[0.02]'
                            : demon.rank <= 75
                            ? 'border-l-emerald-500/50'
                            : 'border-l-slate-700'
                        }`}
                      >
                        
                        {/* Rank & Demon */}
                        <td className="py-3 px-4">
                          <div
                            onClick={() => {
                              audio.playClick();
                              onSelectDemon(demon);
                            }}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <span className="font-mono font-black text-sm text-emerald-400 italic">
                              {formattedRank}
                            </span>
                            <DemonFace difficulty={demon.difficulty} size={20} />
                            <div>
                              <span className="font-bold text-slate-100 group-hover:text-emerald-300 transition-colors uppercase">
                                {demon.name}
                              </span>
                              <div className="text-[9px] text-slate-500">
                                ID: {demon.levelId}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Publisher */}
                        <td className="py-3 px-3 text-slate-300 uppercase text-[11px]">
                          {demon.creator}
                        </td>

                        {/* Verifier */}
                        <td className="py-3 px-3 font-semibold text-emerald-300 uppercase text-[11px]">
                          {demon.verifier || demon.creator}
                        </td>

                        {/* Song */}
                        <td className="py-3 px-3 text-slate-400 truncate max-w-[150px] text-[11px]">
                          {demon.songName}
                        </td>

                        {/* Points */}
                        <td className="py-3 px-3 font-bold text-emerald-400">
                          {demon.points100} PTS
                        </td>

                        {/* My Status */}
                        <td className="py-3 px-3">
                          {bestRun ? (
                            <span className={`px-2 py-0.5 font-bold text-[10px] uppercase ${
                              bestRun.percentage >= 100
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}>
                              {bestRun.percentage >= 100 ? '100% GG' : `${bestRun.percentage}%`}
                            </span>
                          ) : (
                            <span className="text-slate-600 text-[10px]">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                audio.playClick();
                                onPractice(demon);
                              }}
                              className="px-2 py-1 bg-black border border-white/10 text-emerald-300 text-[9px] font-bold tracking-wider uppercase hover:bg-emerald-950/40"
                            >
                              PRACTICE
                            </button>

                            <button
                              onClick={() => {
                                audio.playClick();
                                onAddRun(demon);
                              }}
                              className="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 text-black text-[9px] font-black tracking-wider uppercase"
                            >
                              + RUN
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Empty State */
        <div className="py-16 text-center bg-[#0e0e12] border border-white/5 p-6">
          <SearchX className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-300 uppercase tracking-wider font-mono">No demons found</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4 font-mono">
            Adjust search query, rank bounds, or difficulty filter.
          </p>
          <button
            onClick={onResetFilters}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] uppercase tracking-[0.2em] transition-all font-mono"
          >
            [ Clear All Filters ]
          </button>
        </div>
      )}

      {/* Bottom Pagination */}
      {totalPages > 1 && displayedDemons.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs font-mono">
          <span className="text-slate-500 text-[10px] uppercase tracking-wider">
            SHOWING {(currentPage - 1) * pageSize + 1} - {Math.min(demons.length, currentPage * pageSize)} OF {demons.length.toLocaleString()} DEMONS
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-black border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-[10px] uppercase tracking-wider"
            >
              PREVIOUS
            </button>
            <span className="px-3 py-1.5 bg-black border border-white/10 font-mono font-bold text-emerald-400 text-[10px]">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-black border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-[10px] uppercase tracking-wider"
            >
              NEXT
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
