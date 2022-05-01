import { differenceInDays, formatDistanceToNowStrict } from "date-fns";

import type {
  IClanCurrentRace,
  IMember,
  IMemberWithRaceFame,
  IParticipants,
  IRaceLog,
  IStandings,
} from "./types";

const cleanTag = (clanTag: string) => clanTag.replace("#", "");

export const getClanMembers = async (clanTag: string): Promise<IMember[]> => {
  const url = `https://crproxy.herokuapp.com/clans/%23${cleanTag(
    clanTag
  )}/members`;

  const response = await fetch(url);
  const { data } = await response.json();

  const members = data?.items;
  return members;
};

export const getClanRaceLog = async (clanTag: string): Promise<IRaceLog[]> => {
  const url = `https://crproxy.herokuapp.com/clans/%23${cleanTag(
    clanTag
  )}/riverracelog`;

  const response = await fetch(url);
  const { data } = await response.json();

  const raceLog: IRaceLog[] = data?.items;
  return raceLog;
};

export const getClanCurrentRace = async (
  clanTag: string
): Promise<IClanCurrentRace> => {
  const url = `https://crproxy.herokuapp.com/clans/%23${cleanTag(
    clanTag
  )}/currentriverrace`;

  const response = await fetch(url);
  const { data } = await response.json();

  const currentRace: IClanCurrentRace = data?.clan;
  return currentRace;
};

const getClanMembersWithRaceFame = (
  members: IMember[],
  currentRaceParticipants: IParticipants[],
  lastRaceParticipants: IParticipants[]
) => {
  return members.map((member) => {
    const { tag } = member;

    const currentRaceFame =
      currentRaceParticipants.filter(
        (participant) => participant.tag === tag
      )[0]?.fame || 0;
    const lastRaceFame =
      lastRaceParticipants.filter((participant) => participant.tag === tag)[0]
        ?.fame || 0;

    return {
      ...member,
      currentRaceFame,
      lastRaceFame,
    };
  });
};

export const getClanMembersRaceFame = async (
  clanTag: string,
  members: IMember[],
  raceLog: IRaceLog[],
  currentRace: IClanCurrentRace
): Promise<IMemberWithRaceFame[]> => {
  const getClanStatsOfRace = (race: IRaceLog) => {
    return race.standings.filter((standing) => {
      const { clan } = standing;
      return clan.tag === clanTag;
    })[0];
  };

  const lastRace: IStandings = getClanStatsOfRace(raceLog[0]);

  const currentRaceParticipants: IParticipants[] = currentRace?.participants;
  const lastRaceParticipants: IParticipants[] = lastRace?.clan.participants;

  const clanMembersWithRaceFame: IMemberWithRaceFame[] =
    getClanMembersWithRaceFame(
      members,
      currentRaceParticipants,
      lastRaceParticipants
    );

  return clanMembersWithRaceFame;
};

export const parseDate = (date: string) => {
  const fullDate = date.split(".")[0];
  const simpleDate = fullDate.split("T")[0];

  const year = parseInt(simpleDate.slice(0, 4));
  const month = parseInt(simpleDate.slice(4, 6)) - 1;
  const day = parseInt(simpleDate.slice(6, 8));

  const dateReceived = new Date(year, month, day);

  return formatDistanceToNowStrict(dateReceived, {
    addSuffix: true,
    roundingMethod: "floor",
    unit: "day",
  });
};

export const dateDays = (date: string) => {
  const fullDate = date.split(".")[0];
  const simpleDate = fullDate.split("T")[0];

  const year = parseInt(simpleDate.slice(0, 4));
  const month = parseInt(simpleDate.slice(4, 6)) - 1;
  const day = parseInt(simpleDate.slice(6, 8));

  const dateReceived = new Date(year, month, day);
  return differenceInDays(new Date(), dateReceived);
};
