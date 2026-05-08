'use client';

export default function StandingsTable({ standings }: any) {
  return (
    <div className="w-full overflow-x-auto bg-[#1a2235] rounded-xl border border-gray-800">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-gray-400">
            <th className="p-3">#</th>
            <th className="p-3">Equipo</th>
            <th className="p-3 text-center">PJ</th>
            <th className="p-3 text-center">G</th>
            <th className="p-3 text-center">DG</th>
            <th className="p-3 text-center">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team: any, index: number) => {
            // Lógica de colores de clasificación
            let borderClass = "border-l-4 border-transparent";
            if (index < 4) borderClass = "border-l-4 border-blue-500"; // Champions
            else if (index < 6) borderClass = "border-l-4 border-orange-500"; // Europa League
            else if (index > standings.length - 4) borderClass = "border-l-4 border-red-500"; // Descenso

            return (
              <tr key={team.team.id} className="border-b border-gray-800/50 hover:bg-[#252f4a] transition">
                <td className={`p-3 font-bold ${borderClass}`}>{team.rank}</td>
                <td className="p-3 flex items-center gap-3">
                  <img src={team.team.logo} className="w-5 h-5" alt="" />
                  <span className="font-medium">{team.team.name}</span>
                </td>
                <td className="p-3 text-center">{team.all.played}</td>
                <td className="p-3 text-center text-green-400">{team.all.win}</td>
                <td className="p-3 text-center text-gray-400">{team.goalsDiff}</td>
                <td className="p-3 text-center font-bold text-[#00ff87]">{team.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}