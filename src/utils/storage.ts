import { UserRun, DemonLevel } from '../types';
import { calculateProgressPoints } from '../data/demonList';

const STORAGE_KEY = 'gd_demonlist_user_runs';

export function loadUserRuns(): UserRun[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUserRuns(runs: UserRun[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
  } catch (err) {
    console.error('Failed to save runs to localStorage:', err);
  }
}

export function addUserRun(
  demon: DemonLevel,
  runData: {
    startPercent: number;
    endPercent: number;
    attempts: number;
    sessionAttempts?: number;
    videoProofUrl?: string;
    notes?: string;
    refreshRate: any;
    status?: 'completed' | 'progress' | 'dropped';
  }
): UserRun[] {
  const existing = loadUserRuns();
  const percentage = Math.max(runData.startPercent, runData.endPercent);
  const status = runData.status || (percentage >= 100 ? 'completed' : 'progress');
  const points = calculateProgressPoints(demon.rank, percentage, demon.minPercent);

  // Check if this is a new PB for this level
  const existingLevelRuns = existing.filter(r => r.levelRank === demon.rank);
  const maxPrevPercent = existingLevelRuns.reduce((max, r) => Math.max(max, r.percentage), 0);
  const isPB = percentage > maxPrevPercent;

  // If this is a PB, update prior runs isPB flag
  let updatedExisting = existing;
  if (isPB) {
    updatedExisting = existing.map(r => (r.levelRank === demon.rank ? { ...r, isPB: false } : r));
  }

  const newRun: UserRun = {
    id: `run_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    levelRank: demon.rank,
    levelName: demon.name,
    percentage,
    startPercent: runData.startPercent,
    endPercent: runData.endPercent,
    attempts: runData.attempts,
    sessionAttempts: runData.sessionAttempts,
    videoProofUrl: runData.videoProofUrl,
    notes: runData.notes,
    date: new Date().toISOString().split('T')[0],
    refreshRate: runData.refreshRate,
    status,
    isPB,
    earnedPoints: points
  };

  const nextList = [newRun, ...updatedExisting];
  saveUserRuns(nextList);
  return nextList;
}

export function deleteUserRun(id: string): UserRun[] {
  const existing = loadUserRuns();
  const nextList = existing.filter(r => r.id !== id);
  saveUserRuns(nextList);
  return nextList;
}

export function calculateUserStats(runs: UserRun[]) {
  // Deduplicate by level to get user's best completion / highest points per demon
  const levelBestMap = new Map<number, UserRun>();
  let totalAttempts = 0;

  for (const r of runs) {
    totalAttempts += (r.attempts || 0);
    const prev = levelBestMap.get(r.levelRank);
    if (!prev || r.percentage > prev.percentage) {
      levelBestMap.set(r.levelRank, r);
    }
  }

  let totalPoints = 0;
  let completedCount = 0;
  let inProgressCount = 0;
  let hardestBeatenRank: number | null = null;
  let hardestBeatenName: string | null = null;

  for (const best of levelBestMap.values()) {
    totalPoints += best.earnedPoints || 0;
    if (best.percentage >= 100) {
      completedCount++;
      if (hardestBeatenRank === null || best.levelRank < hardestBeatenRank) {
        hardestBeatenRank = best.levelRank;
        hardestBeatenName = best.levelName;
      }
    } else {
      inProgressCount++;
    }
  }

  return {
    totalRunsLogged: runs.length,
    distinctLevelsTracked: levelBestMap.size,
    completedCount,
    inProgressCount,
    totalPoints: Number(totalPoints.toFixed(1)),
    totalAttempts,
    hardestBeatenRank,
    hardestBeatenName
  };
}
