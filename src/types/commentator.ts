export type CommentatorRole = 
  | 'NARRADOR_PLAY_BY_PLAY' 
  | 'COMENTARISTA_SABERMETRICO' 
  | 'VOZ_COMERCIAL_Y_COLOR';

export type SponsorTrigger = 
  | 'HR' 
  | 'DP' 
  | 'PITCH_CHANGE' 
  | 'FATIGUE_75';

export interface AssignedSponsor {
  id: string;
  brand: string;
  trigger: SponsorTrigger;
  text: string;
}

export interface CommentatorPrivateNote {
  id: string;
  text: string;
  target: 'batter' | 'pitcher' | 'game';
  timestamp: number;
}

export interface CommentatorStats {
  gamesBroadcasted: number;
  pillsRead: number;
}

export interface CommentatorWorkspace {
  id: string; // ID único del comentarista (ej. comm_pedro_chavez)
  name: string; // Nombre del narrador
  handle: string; // @handle
  team: string; // Equipo al que pertenece la transmisión (ej. "Guerreros de Tampa")
  mediaOutlet: string; // Medio (YouTube, Radio, TV)
  role: CommentatorRole;
  channelUrl: string;
  activeGameId: string;
  catchphrase: string;
  privateNotes: CommentatorPrivateNote[]; // Espacio individual de notas privadas
  assignedSponsors: AssignedSponsor[]; // Patrocinios individuales de su turno
  stats: CommentatorStats;
  status: 'on_air' | 'standby';
  createdAt: string;
}

export type Commentator = CommentatorWorkspace;

export interface BroadcastSponsor {
  id: string;
  brandName: string;
  category: string;
  triggerEvent: SponsorTrigger;
  scriptText: string;
  durationSeconds: number;
  active: boolean;
}
