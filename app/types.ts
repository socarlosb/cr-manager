export interface IMember {
  tag: string;
  name: string;
  role: string;
  lastSeen: string;
  expLevel: number;
  trophies: number;
  arena: {
    id: number;
    name: string;
  };
  clanRank: number;
  previousClanRank: number;
  donations: number;
  donationsReceived: number;
  clanChestPoints: number;
}

export interface IMemberWithRaceFame extends IMember {
  currentRaceFame: number;
  lastRaceFame: number;
}

export interface IParticipants {
  tag: string;
  name: string;
  fame: number;
  repairPoints: number;
  boatAttacks: number;
  decksUsed: number;
  decksUsedToday: number;
}

export interface IStandings {
  rank: number;
  trophyChange: number;
  clan: {
    tag: string;
    name: string;
    badgeId: number;
    fame: number;
    finishTime: string;
    periodPoints: number;
    clanScore: number;
    participants: [IParticipants];
  };
}

export interface IRaceLog {
  seasonId: number;
  sectionIndex: number;
  createdDate: string;
  standings: [IStandings];
}

export interface IClanCurrentRace {
  tag: string;
  name: string;
  badgeId: number;
  fame: number;
  clanScore: number;
  participants: [IParticipants];
}
