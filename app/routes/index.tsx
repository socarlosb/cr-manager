import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  dateDays,
  getClanCurrentRace,
  getClanMembers,
  getClanMembersRaceFame,
  getClanRaceLog,
  parseDate,
} from "~/utils";
import type { IMemberWithRaceFame } from "~/types";
import { options } from "~/options";

export const loader: LoaderFunction = async () => {
  const riverRaceLog = await getClanRaceLog("#YVYYC9QC");
  const members = await getClanMembers("#YVYYC9QC");
  const currentRace = await getClanCurrentRace("#YVYYC9QC");
  const membersWithRaceLog = await getClanMembersRaceFame(
    "#YVYYC9QC",
    members,
    riverRaceLog,
    currentRace
  );

  return json({ members: membersWithRaceLog });
};

interface IProps {
  members: IMemberWithRaceFame[];
}

export default function Index() {
  const { members }: IProps = useLoaderData();
  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="sticky top-0 bg-gray-800 text-center text-white pt-2">
        <h1 className="text-xl font-medium">Bock Royale</h1>
      </div>
      <div className="overflow-auto">
        <table className="w-full relative">
          <thead className="">
            <tr>
              <th
                scope="col"
                className="text-xs font-medium text-white py-4 text-center sticky top-0 border-b bg-gray-800"
              >
                #
              </th>
              <th
                scope="col"
                className="text-xs font-medium text-white py-4 text-left sticky top-0 border-b bg-gray-800"
              >
                Member
              </th>
              <th
                scope="col"
                className="text-xs font-medium text-white py-4 text-left sticky top-0 border-b bg-gray-800"
              >
                Stats
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member: IMemberWithRaceFame) => (
              <tr
                key={member.tag}
                className="bg-white border-b hover:bg-gray-100"
              >
                <td className="py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center px-2">
                  <p>{member.clanRank}</p>
                  <span className="text-xs text-gray-500">
                    ({member.previousClanRank})
                  </span>
                </td>
                <td className="text-sm text-gray-900 font-light py-4 whitespace-nowrap">
                  <h3 className="font-semibold py-0.5">{member.name}</h3>
                  <p className="text-gray-400 text-xs uppercase py-0.5">
                    {member.role}
                  </p>
                  <p
                    className={`text-gray-600 text-xs ${
                      dateDays(member.lastSeen) >= options.awayMaxDays
                        ? "text-red-400 font-bold"
                        : dateDays(member.lastSeen) >= options.awayDangerDays
                        ? "text-orange-400 font-bold"
                        : ""
                    }`}
                  >
                    Online {parseDate(member.lastSeen)}
                  </p>
                </td>
                <td className="text-xs text-gray-800 font-light py-2 whitespace-nowrap">
                  <p>Trophies: {member.trophies}</p>
                  <p>Donations Given: {member.donations}</p>
                  <p>Donations Received: {member.donationsReceived}</p>
                  <p
                    className={`${
                      member.currentRaceFame < options.warWeekFame
                        ? "text-red-400 font-bold"
                        : ""
                    }`}
                  >
                    War Fame: {member.currentRaceFame}
                  </p>
                  <p
                    className={`${
                      member.lastRaceFame < options.warWeekFame
                        ? "text-red-400 font-bold"
                        : ""
                    }`}
                  >
                    Last War Fame: {member.lastRaceFame}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer>
        <div className="sticky top-0 bg-gray-800 text-center text-white py-2">
          <h1 className="text-sm font-light">@2022</h1>
        </div>
      </footer>
    </div>
  );
}
