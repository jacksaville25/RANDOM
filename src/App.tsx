/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ALL_DEMONS } from './data/demonList';
import { DemonLevel, FilterState, UserRun } from './types';
import { loadUserRuns, saveUserRuns, addUserRun, deleteUserRun, calculateUserStats } from './utils/storage';
import { audio } from './utils/audio';

import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { DemonGrid } from './components/DemonGrid';
import { LevelDetailModal } from './components/LevelDetailModal';
import { AddRunModal } from './components/AddRunModal';
import { PracticeGrinderModal } from './components/PracticeGrinderModal';
import { TrackerDashboard } from './components/TrackerDashboard';
import { PointsCalculatorView } from './components/PointsCalculatorView';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<'list' | 'tracker' | 'practice' | 'calculator'>('list');
  const [soundEnabled, setSoundEnabled] = React.useState<boolean>(audio.getSoundEnabled());
  const [userRuns, setUserRuns] = React.useState<UserRun[]>(() => {
    const existing = loadUserRuns();
    if (existing.length > 0) return existing;
    
    // Seed starter example runs for instant gameplay preview
    const initialRuns: UserRun[] = [
      {
        id: 'run_seed_1',
        levelRank: 39,
        levelName: 'Bloodbath',
        percentage: 100,
        startPercent: 0,
        endPercent: 100,
        attempts: 4320,
        notes: 'Finally conquered the 1.9 legend! Fluked from Michigun 25%',
        date: '2024-05-10',
        refreshRate: '240Hz',
        status: 'completed',
        isPB: true,
        earnedPoints: 86.4
      },
      {
        id: 'run_seed_2',
        levelRank: 40,
        levelName: 'Cataclysm',
        percentage: 100,
        startPercent: 0,
        endPercent: 100,
        attempts: 1850,
        notes: 'Classic first extreme demon completion.',
        date: '2024-03-14',
        refreshRate: '144Hz',
        status: 'completed',
        isPB: true,
        earnedPoints: 84.1
      },
      {
        id: 'run_seed_3',
        levelRank: 1,
        levelName: 'Tidal Wave',
        percentage: 64,
        startPercent: 0,
        endPercent: 64,
        attempts: 14200,
        notes: 'Passed the beach wave drop! Grinding to 100%.',
        date: '2024-07-22',
        refreshRate: '360Hz',
        status: 'progress',
        isPB: true,
        earnedPoints: 22.5
      },
      {
        id: 'run_seed_4',
        levelRank: 2,
        levelName: 'Acheron',
        percentage: 42,
        startPercent: 0,
        endPercent: 42,
        attempts: 6500,
        notes: 'Practice run on the drop corridor.',
        date: '2024-06-18',
        refreshRate: 'Physics Bypass / CBF',
        status: 'progress',
        isPB: true,
        earnedPoints: 0
      }
    ];
    saveUserRuns(initialRuns);
    return initialRuns;
  });

  const [filters, setFilters] = React.useState<FilterState>({
    search: '',
    tier: 'all',
    minRank: 1,
    maxRank: 1500,
    difficulty: 'all',
    sortBy: 'rank-asc',
    onlyTracked: false,
    onlyCompleted: false
  });

  // Modals state
  const [selectedDemonForModal, setSelectedDemonForModal] = React.useState<DemonLevel | null>(null);
  const [demonForAddRun, setDemonForAddRun] = React.useState<DemonLevel | null>(null);
  const [isAddRunOpen, setIsAddRunOpen] = React.useState(false);
  const [isPracticeOpen, setIsPracticeOpen] = React.useState(false);
  const [demonForPractice, setDemonForPractice] = React.useState<DemonLevel | null>(null);

  const userStats = React.useMemo(() => {
    return calculateUserStats(userRuns);
  }, [userRuns]);

  // Filter and Sort demons across all 1500 entries
  const filteredDemons = React.useMemo(() => {
    return ALL_DEMONS.filter(d => {
      // Search match
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        const matchesName = d.name.toLowerCase().includes(q);
        const matchesCreator = d.creator.toLowerCase().includes(q);
        const matchesVerifier = d.verifier && d.verifier.toLowerCase().includes(q);
        const matchesSong = d.songName.toLowerCase().includes(q) || d.songArtist.toLowerCase().includes(q);
        const matchesId = d.levelId.includes(q) || d.rank.toString() === q;
        if (!matchesName && !matchesCreator && !matchesVerifier && !matchesSong && !matchesId) {
          return false;
        }
      }

      // Rank Range
      if (d.rank < filters.minRank || d.rank > filters.maxRank) {
        return false;
      }

      // Tier filter
      if (filters.tier === 'top10' && d.rank > 10) return false;
      if (filters.tier === 'main' && (d.rank < 1 || d.rank > 75)) return false;
      if (filters.tier === 'extended' && (d.rank < 76 || d.rank > 150)) return false;
      if (filters.tier === 'legacy' && d.rank < 151) return false;

      // Difficulty category
      if (filters.difficulty !== 'all' && d.difficulty !== filters.difficulty) {
        return false;
      }

      // Tracked filter
      if (filters.onlyTracked) {
        const hasRun = userRuns.some(r => r.levelRank === d.rank);
        if (!hasRun) return false;
      }

      // Completed filter
      if (filters.onlyCompleted) {
        const hasCompleted = userRuns.some(r => r.levelRank === d.rank && r.percentage >= 100);
        if (!hasCompleted) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'rank-desc') return b.rank - a.rank;
      if (filters.sortBy === 'points') return b.points100 - a.points100;
      if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
      if (filters.sortBy === 'difficulty') {
        const order = { top_10: 1, extreme: 2, insane: 3, hard: 4, legendary_extreme: 1 };
        return (order[a.difficulty] || 5) - (order[b.difficulty] || 5);
      }
      return a.rank - b.rank; // default 'rank-asc'
    });
  }, [filters, userRuns]);

  // Handlers
  const handleOpenAddRun = (demon?: DemonLevel) => {
    setDemonForAddRun(demon || null);
    setIsAddRunOpen(true);
  };

  const handleOpenPractice = (demon?: DemonLevel) => {
    setDemonForPractice(demon || ALL_DEMONS[0]);
    setIsPracticeOpen(true);
  };

  const handleSaveRun = (demon: DemonLevel, runData: any) => {
    const updated = addUserRun(demon, runData);
    setUserRuns(updated);
  };

  const handleDeleteRun = (runId: string) => {
    const updated = deleteUserRun(runId);
    setUserRuns(updated);
  };

  const handleImportRuns = (imported: UserRun[]) => {
    saveUserRuns(imported);
    setUserRuns(imported);
  };

  const handleResetFilters = () => {
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
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black flex flex-col justify-between">
      
      <div>
        {/* Top Header & Navigation */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAddRun={() => handleOpenAddRun()}
          onOpenPractice={() => handleOpenPractice()}
          userStats={userStats}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-16">
          
          {/* Tab 1: Demon List (#1 - #1500) */}
          {activeTab === 'list' && (
            <div className="space-y-6">
              
              {/* Search and Filters Bar */}
              <SearchBar
                filters={filters}
                setFilters={setFilters}
                totalMatches={filteredDemons.length}
                totalListCount={ALL_DEMONS.length}
              />

              {/* Demon Cards Grid / Table */}
              <DemonGrid
                demons={filteredDemons}
                userRuns={userRuns}
                onSelectDemon={(demon) => setSelectedDemonForModal(demon)}
                onAddRun={(demon) => handleOpenAddRun(demon)}
                onPractice={(demon) => handleOpenPractice(demon)}
                onResetFilters={handleResetFilters}
              />
            </div>
          )}

          {/* Tab 2: My Runs & Progress Dashboard */}
          {activeTab === 'tracker' && (
            <TrackerDashboard
              userRuns={userRuns}
              userStats={userStats}
              onOpenAddRun={() => handleOpenAddRun()}
              onOpenPractice={() => handleOpenPractice()}
              onSelectDemon={(demon) => setSelectedDemonForModal(demon)}
              onDeleteRun={handleDeleteRun}
              onImportRuns={handleImportRuns}
            />
          )}

          {/* Tab 3: Practice Grinder Live */}
          {activeTab === 'practice' && (
            <div className="space-y-6">
              <PracticeGrinderModal
                initialDemon={demonForPractice || ALL_DEMONS[0]}
                onClose={() => setActiveTab('list')}
                onSaveRun={handleSaveRun}
              />
            </div>
          )}

          {/* Tab 4: Points & Ranking Calculator */}
          {activeTab === 'calculator' && (
            <PointsCalculatorView />
          )}

        </main>
      </div>

      {/* Editorial Community Footer */}
      <footer className="bg-[#0e0e12] border-t border-white/5 px-4 sm:px-8 py-5 text-[10px] font-mono tracking-widest text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-6 sm:gap-8 uppercase">
          <div>TOTAL DEMONS: <span className="text-emerald-400 font-bold">1,500</span></div>
          <div>VERIFICATIONS: <span className="text-slate-300 font-bold">4,192</span></div>
          <div>ACTIVE PLAYERS: <span className="text-slate-300 font-bold">12,940</span></div>
          <div>STANDARD: <span className="text-emerald-400 font-bold">POINTERCRATE SCALE</span></div>
        </div>
        <div className="uppercase text-slate-600">
          © DEMONLIST-CORE • GEOMETRY DASH COMMUNITY
        </div>
      </footer>

      {/* Level Detail Showcase Modal */}
      {selectedDemonForModal && (
        <LevelDetailModal
          demon={selectedDemonForModal}
          onClose={() => setSelectedDemonForModal(null)}
          userRuns={userRuns}
          onAddRun={(demon) => {
            setSelectedDemonForModal(null);
            handleOpenAddRun(demon);
          }}
          onPractice={(demon) => {
            setSelectedDemonForModal(null);
            handleOpenPractice(demon);
          }}
          onDeleteRun={handleDeleteRun}
        />
      )}

      {/* Add Run Modal */}
      {isAddRunOpen && (
        <AddRunModal
          initialDemon={demonForAddRun}
          onClose={() => {
            setIsAddRunOpen(false);
            setDemonForAddRun(null);
          }}
          onSaveRun={handleSaveRun}
        />
      )}

      {/* Practice Modal (if opened as modal overlay from a card) */}
      {isPracticeOpen && activeTab !== 'practice' && (
        <PracticeGrinderModal
          initialDemon={demonForPractice}
          onClose={() => {
            setIsPracticeOpen(false);
            setDemonForPractice(null);
          }}
          onSaveRun={handleSaveRun}
        />
      )}

    </div>
  );
}
