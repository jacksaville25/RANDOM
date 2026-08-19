export type DemonDifficulty = 'top_10' | 'extreme' | 'insane' | 'hard' | 'legendary_extreme';

export type ListTier = 'all' | 'top10' | 'main' | 'extended' | 'legacy';

export interface DemonLevel {
  rank: number;
  name: string;
  creator: string;
  verifier: string;
  publisher: string;
  levelId: string;
  songName: string;
  songArtist: string;
  songId: string;
  difficulty: DemonDifficulty;
  videoUrl: string;
  description: string;
  minPercent: number;
  points100: number;
  pointsRequirement: number;
  objectCount: number;
  fpsRequirement: string;
  releaseDate: string;
  tags: string[];
  records?: CommunityRecord[];
}

export interface CommunityRecord {
  player: string;
  percentage: number;
  hz: string;
  videoUrl: string;
  date: string;
}

export type RefreshRate = '60Hz' | '144Hz' | '240Hz' | '360Hz' | 'Physics Bypass / CBF';

export type RunStatus = 'completed' | 'progress' | 'dropped';

export interface UserRun {
  id: string;
  levelRank: number;
  levelName: string;
  percentage: number;
  startPercent: number;
  endPercent: number;
  attempts: number;
  sessionAttempts?: number;
  videoProofUrl?: string;
  notes?: string;
  date: string;
  refreshRate: RefreshRate;
  status: RunStatus;
  isPB: boolean;
  earnedPoints: number;
}

export interface PracticeSession {
  levelRank: number;
  levelName: string;
  currentAttempts: number;
  totalAttempts: number;
  startTime: number;
  elapsedSeconds: number;
  bestStartPercent: number;
  bestEndPercent: number;
  notes: string;
}

export interface FilterState {
  search: string;
  tier: ListTier;
  minRank: number;
  maxRank: number;
  difficulty: string;
  sortBy: 'rank-asc' | 'rank-desc' | 'points' | 'name' | 'difficulty' | 'attempts';
  onlyTracked: boolean;
  onlyCompleted: boolean;
}
