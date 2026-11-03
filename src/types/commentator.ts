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

export interface CommentatorStats {
  gamesBroadcasted: number;
  pillsRead: number;
}

export interface Commentator {
  id: string;
  name: string;
  handle: string;
  mediaOutlet: string;
  role: CommentatorRole;
  channelUrl: string;
  activeGameId: string;
  catchphrase: string;
  assignedSponsors: AssignedSponsor[];
  stats: CommentatorStats;
  status: 'on_air' | 'standby';
  createdAt: string;
}

export interface BroadcastSponsor {
  id: string;
  brandName: string;
  category: string;
  triggerEvent: SponsorTrigger;
  scriptText: string;
  durationSeconds: number;
  active: boolean;
}
