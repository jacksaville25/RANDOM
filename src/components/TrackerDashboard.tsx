import React from 'react';
import { Trophy, Flame, Play, PlusCircle, CheckCircle, Download, Upload, Trash2, ExternalLink, Calendar, Shield, Hash } from 'lucide-react';
import { UserRun, DemonLevel } from '../types';
import { ALL_DEMONS, getTierForRank } from '../data/demonList';
import { DemonFace, GDStarIcon } from './GDIcons';
import { audio } from '../utils/audio';

interface TrackerDashboardProps {
  userRuns: UserRun[];
  userStats: {
    totalPoints: number;
    completedCount: number;
    inProgressCount: number;
    distinctLevelsTracked: number;
    totalAttempts: number;
    hardestBeatenName: string | null;
    hardestBeatenRank: number | null;
  };
  onOpenAddRun: () => void;
  onOpenPractice: () => void;
  onSelectDemon: (demon: DemonLevel) => void;
  onDeleteRun: (runId: string) => void;
  onImportRuns: (runs: UserRun[]) => void;
}

export const TrackerDashboard: React.FC<TrackerDashboardProps> = ({
  userRuns,
  userStats,
  onOpenAddRun,
  onOpenPractice,
  onSelectDemon,
  onDeleteRun,
  onImportRuns
}) => {
  const [filterType, setFilterType] = React.useState<'all' | 'completed' | 'progress'>('all');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const filteredRuns = React.useMemo(() => {
    if (filterType === 'completed') return userRuns.filter(r => r.percentage >= 100);
    if (filterType === 'progress') return userRuns.filter(r => r.percentage < 100);
    return userRuns;
  }, [userRuns, filterType]);

  const handleExportJSON = () => {
    audio.playCheckpoint();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userRuns, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gd_demon_runs_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            audio.playCompleteFanfare();
            onImportRuns(parsed);
          }
        } catch {
          alert("Invalid JSON backup file.");
        }
      };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Profile Stat Banners (Editorial Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Total Points */}
        <div className="p-5 bg-[#0e0e12] border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">Total List Points</span>
            <span className="text-[10px] font-mono text-emerald-400">PTS</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black italic text-emerald-400 font-mono mt-3">
            {userStats.totalPoints}
          </div>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1">Pointercrate scaled yield</p>
        </div>

        {/* Hardest Demon */}
        <div className="p-5 bg-[#0e0e12] border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">Hardest Conquest</span>
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold uppercase tracking-tight text-slate-100 mt-3 truncate font-mono">
            {userStats.hardestBeatenName ? (
              <span className="text-emerald-400">#{userStats.hardestBeatenRank} {userStats.hardestBeatenName}</span>
            ) : (
              <span className="text-slate-600 text-sm">NO COMPLETIONS</span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1">Peak 100% Extreme record</p>
        </div>

        {/* 100% Completions */}
        <div className="p-5 bg-[#0e0e12] border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">Demons Beaten</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-black italic text-emerald-400 font-mono mt-3">
            {userStats.completedCount} <span className="text-sm font-normal text-slate-500 font-mono">GG</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1">{userStats.inProgressCount} active grinds</p>
        </div>

        {/* Total Attempts */}
        <div className="p-5 bg-[#0e0e12] border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">Total Attempts</span>
            <Play className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-black italic text-slate-100 font-mono mt-3">
            {userStats.totalAttempts.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1">{userStats.distinctLevelsTracked} tracked levels</p>
        </div>

      </div>

      {/* Main Table and Manager */}
      <div className="bg-[#0e0e12] border border-white/5 p-4 sm:p-6 shadow-2xl">
        
        {/* Table Header & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h3 className="text-sm sm:text-base font-black tracking-wider uppercase text-emerald-400 font-mono flex items-center gap-2">
              <span>// YOUR PROGRESS & RUN ARCHIVE ({userRuns.length})</span>
            </h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">
              Verified sessions, milestone segment runs, and practice history
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Buttons */}
            <div className="flex items-center gap-1 bg-black p-0.5 border border-white/10 text-xs font-mono">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 font-bold text-[10px] tracking-wider uppercase transition-all ${
                  filterType === 'all' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ALL ({userRuns.length})
              </button>
              <button
                onClick={() => setFilterType('completed')}
                className={`px-3 py-1 font-bold text-[10px] tracking-wider uppercase transition-all ${
                  filterType === 'completed' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                100% GG ({userStats.completedCount})
              </button>
              <button
                onClick={() => setFilterType('progress')}
                className={`px-3 py-1 font-bold text-[10px] tracking-wider uppercase transition-all ${
                  filterType === 'progress' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                PROGRESS ({userStats.inProgressCount})
              </button>
            </div>

            {/* Quick Actions */}
            <button
              onClick={() => {
                audio.playClick();
                onOpenAddRun();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] font-mono tracking-widest uppercase transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ LOG RUN</span>
            </button>

            {/* JSON Export / Import */}
            <button
              onClick={handleExportJSON}
              className="p-1.5 bg-black hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-mono uppercase"
              title="Export Runs as JSON backup"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 bg-black hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-mono uppercase"
              title="Import Runs from JSON backup"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* Runs List Table */}
        {filteredRuns.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs text-left font-mono">
              <thead className="text-slate-400 bg-black/60 uppercase font-bold text-[9px] tracking-widest border-b border-white/5">
                <tr>
                  <th className="py-3 px-3">Level Rank & Name</th>
                  <th className="py-3 px-3">Progress</th>
                  <th className="py-3 px-3">Points</th>
                  <th className="py-3 px-3">Attempts</th>
                  <th className="py-3 px-3">Refresh</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRuns.map((run) => {
                  const demon = ALL_DEMONS.find(d => d.rank === run.levelRank);
                  const formattedRank = run.levelRank < 10 ? `0${run.levelRank}` : `${run.levelRank}`;

                  return (
                    <tr
                      key={run.id}
                      className={`hover:bg-white/5 transition-colors border-l-4 ${
                        run.percentage >= 100 ? 'border-l-emerald-400' : 'border-l-slate-700'
                      }`}
                    >
                      
                      {/* Level Name */}
                      <td className="py-3 px-3">
                        <div
                          onClick={() => {
                            if (demon) {
                              audio.playClick();
                              onSelectDemon(demon);
                            }
                          }}
                          className="flex items-center gap-2.5 cursor-pointer group"
                        >
                          <span className="font-mono font-black italic text-emerald-400 text-sm">
                            {formattedRank}
                          </span>
                          {demon && <DemonFace difficulty={demon.difficulty} size={18} />}
                          <div>
                            <span className="font-bold text-slate-200 group-hover:text-emerald-300 transition-colors uppercase">
                              {run.levelName}
                            </span>
                            {run.notes && (
                              <p className="text-[10px] text-slate-500 italic line-clamp-1 max-w-[200px]">
                                {run.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Progress */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                            run.percentage >= 100
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}>
                            {run.startPercent > 0 ? `${run.startPercent}-${run.endPercent}%` : `${run.percentage}%`}
                          </span>
                          {run.isPB && (
                            <span className="text-[8px] px-1 py-0.5 bg-emerald-500/30 text-emerald-300 font-extrabold uppercase">
                              PB
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Points */}
                      <td className="py-3 px-3 font-bold text-emerald-400 font-mono">
                        {run.earnedPoints > 0 ? `+${run.earnedPoints} PTS` : '—'}
                      </td>

                      {/* Attempts */}
                      <td className="py-3 px-3 font-mono text-slate-300">
                        {run.attempts.toLocaleString()}
                      </td>

                      {/* Refresh */}
                      <td className="py-3 px-3 text-slate-400 text-[10px]">
                        {run.refreshRate}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-slate-500 text-[10px]">
                        {run.date}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {run.videoProofUrl && (
                            <a
                              href={run.videoProofUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-black"
                              title="Watch Proof Video"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => {
                              audio.playClick();
                              onDeleteRun(run.id);
                            }}
                            className="p-1 text-slate-500 hover:text-red-400 hover:bg-black"
                            title="Delete this run"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 text-xs font-mono">
            <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="font-bold text-slate-400 uppercase tracking-wider">No runs logged under this filter</p>
            <p className="text-[10px] text-slate-500 mt-1 uppercase">
              Select any level from the demon list or click "Log Run" to begin.
            </p>
            <button
              onClick={() => {
                audio.playClick();
                onOpenAddRun();
              }}
              className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] uppercase tracking-[0.2em]"
            >
              + Log Your First Run
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
