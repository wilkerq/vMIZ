export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export enum AuthStatus {
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
}

export interface GraphicEvent {
  id: string;
  startTime: number; // in seconds
  duration: number; // in seconds, 0 for infinite
  vMixInput: string; // Name or number of the GT input in vMix
  vMixOverlayChannel: number; // 1, 2, 3, or 4
  textFields: { field: string; text: string }[];
}


export interface Asset {
  id: string;
  name: string;
  type: 'Video' | 'Image' | 'Audio';
  fileSize: string;
  uploadDate: string;
  tags: string[];
  url: string; // URL for the asset preview
  resolution?: string;
  duration?: string;
  codec?: string;
  inPoint?: string; // e.g., '00:00:05'
  outPoint?: string; // e.g., '00:00:10'
  graphicsEvents?: GraphicEvent[];
}

export interface PlayoutLog {
  id: string;
  timestamp: string; // ISO string
  assetName: string;
  eventType: 'PLAY_START' | 'PLAY_END' | 'ERROR';
  duration?: string; // e.g., '00:05:30'
  details: string;
}

export enum SourceType {
  VIDEO = 'Vídeo',
  IMAGE = 'Imagem',
  AUDIO = 'Áudio',
  NDI = 'NDI',
  SDI = 'SDI',
  SRT = 'SRT',
  RTMP = 'RTMP',
}

export enum SourceStatus {
  OK = 'OK',
  WARNING = 'Aviso',
  ERROR = 'Erro',
}

export type PlayoutItem = {
  id: string;
  name: string;
  type: SourceType | 'GROUP_HEADER'; // Add GROUP_HEADER type
  duration: string;
  status: SourceStatus;
  url?: string; // For stream-based or file-based sources
  isCollapsed?: boolean; // For GROUP_HEADER
  inPoint?: string; // e.g., '00:00:05'
  outPoint?: string; // e.g., '00:00:10'
  graphicsEvents?: GraphicEvent[];
};

export interface Playlist {
  id: string;
  name: string;
  items: PlayoutItem[];
  createdAt: string;
  totalDuration: string;
}

export interface Settings {
    vMixIpAddress: string;
    vMixPort: number;
}

// Types for the new Scripting feature
export interface ScriptItem {
  id: string;
  video: string; // HTML content for the video column
  audio: string; // HTML content for the audio/VO column
  duration: string; // HH:MM:SS format
  linkedAssetId?: string;
  linkedAssetName?: string;
}

export interface Script {
  id: string;
  title: string;
  items: ScriptItem[];
  createdAt: string;
  updatedAt: string;
}


// --- Types for the new Journalism Module ---

export interface NewsProgram {
  id: string;
  name: string;
  defaultStartTime: string; // e.g., "19:00:00"
  defaultDuration: string; // e.g., "00:28:30"
  vMixIpAddress?: string; // Optional override
  vMixPort?: number; // Optional override
}

export enum RundownItemType {
  STORY = 'MATÉRIA',
  LIVE = 'VIVO',
  VT = 'VT',
  GRAPHIC = 'GC',
  COMMERCIAL = 'COMERCIAL',
  OPENER = 'ABERTURA',
  CLOSER = 'ENCERRAMENTO',
}

export enum RundownItemStatus {
  DRAFT = 'RASCUNHO',
  READY = 'PRONTO',
  ON_AIR = 'NO AR',
  DONE = 'EXIBIDO',
  HOLD = 'AGUARDANDO',
}

export interface RundownItem {
  id: string;
  type: RundownItemType;
  slug: string; // e.g., "COLD OPEN" or "ECONOMY REPORT"
  talent?: string;
  camera?: string;
  estimatedDuration: string; // Planned duration
  actualDuration?: string; // Actual on-air duration
  status: RundownItemStatus;
  storyId?: string; // Link to the detailed story/script
  linkedAssetId?: string;
  linkedAssetName?: string;
}

export interface Rundown {
  id: string;
  programId: string;
  date: string; // YYYY-MM-DD
  title: string; // e.g., "Evening News - July 26, 2024"
  items: RundownItem[];
  startTime: string; // HH:MM:SS
  estimatedTotalDuration: string;
  status: 'RASCUNHO' | 'PRONTO' | 'NO AR' | 'ARQUIVADO';
}

export interface Story {
  id: string;
  title: string;
  script: string; // HTML content from the rich text editor
  status: 'RASCUNHO' | 'ESCREVENDO' | 'APROVADO' | 'PRONTO';
  estimatedScriptDuration?: string;
  linkedAssets?: { id: string; name: string; type: Asset['type'] }[];
}

// Utility functions for time calculations.
// Placed here due to inability to create new files in the project structure.

export const parseDurationToSeconds = (duration: string): number => {
  if (!duration || typeof duration !== 'string') return 0;
  const parts = duration.split(':').map(Number);
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
  }
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return (minutes || 0) * 60 + (seconds || 0);
  }
  return 0;
};

export const formatSecondsToDuration = (totalSeconds: number): string => {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return [hours, minutes, seconds]
    .map(v => v.toString().padStart(2, '0'))
    .join(':');
};

// This is for time of day from seconds from midnight
export const formatSecondsToTime = (totalSeconds: number): string => {
    return formatSecondsToDuration(totalSeconds % (24 * 3600));
}

export const addDurations = (time1: string, time2: string): string => {
    const seconds1 = parseDurationToSeconds(time1);
    const seconds2 = parseDurationToSeconds(time2);
    return formatSecondsToDuration(seconds1 + seconds2);
}