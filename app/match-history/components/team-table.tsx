"use client"

import Image from 'next/image'

type MatchItem = {
  id: number
  image: string
}

type TeamMember = {
  name: string
  champion: string
  image: string
}

type MatchData = {
  id: number
  champion: {
    name: string
    image: string
  }
  result: string
  kda: string
  kdaRatio: number
  role: string
  gameType: string
  duration: string
  timestamp: string
  items: MatchItem[]
  team: TeamMember[]
}

export default function TeamTable({ matchData }: { matchData: MatchData }) {
  // Tạo dữ liệu cho đội hình bên mình (add player hiện tại và team)
  const allyTeam = [
    { name: matchData.champion.name, champion: matchData.champion.name, image: matchData.champion.image },
    ...matchData.team.slice(0, 2) // Giả sử 2 người đầu là team mình
  ];
  
  // Tạo dữ liệu cho đội hình địch
  const enemyTeam = matchData.team.slice(2); // Giả sử phần còn lại là team địch
  
  // Thêm thành viên ảo cho đủ 5 người đội mình nếu không đủ
  while (allyTeam.length < 5) {
    allyTeam.push({
      name: `Player ${allyTeam.length + 1}`,
      champion: "Unknown",
      image: "https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg"
    });
  }
  
  // Thêm thành viên ảo cho đủ 5 người đội địch nếu không đủ
  while (enemyTeam.length < 5) {
    enemyTeam.push({
      name: `Enemy ${enemyTeam.length + 1}`,
      champion: "Unknown",
      image: "https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg"
    });
  }

  // Render function cho một team (dùng lại cho cả 2 đội)
  const renderTeamTable = (team: TeamMember[], isAlly: boolean) => (
    <div className="w-full bg-black rounded-lg overflow-hidden border border-[#2a2a30]">
      <h3 className={`text-lg font-medium p-4 ${isAlly ? "bg-blue-900/30 text-blue-400" : "bg-red-900/30 text-red-400"} border-b border-[#2a2a30]`}>
        {isAlly ? "Đội hình bên mình" : "Đội hình địch"}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs uppercase bg-black text-gray-500">
            <tr>
              <th className="py-2 px-2">Level</th>
              <th className="py-2 px-4">Người chơi</th>
              <th className="py-2 px-4">CS / Gold</th>
              <th className="py-2 px-4">Trang bị</th>
            </tr>
          </thead>
          <tbody>
            {team.map((player, index) => (
              <tr key={player.name + index} className="bg-black border-t border-[#2a2a30] hover:bg-[#0a0a0a]">
                <td className="py-3 px-2">
                  <div className="flex items-center">
                    <div className={`w-7 h-7 ${isAlly ? "bg-blue-600/20 text-blue-500" : "bg-red-600/20 text-red-500"} rounded-full flex items-center justify-center text-xs font-bold`}>
                      18
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 flex-shrink-0">
                      <Image
                        src={player.image}
                        alt={player.champion}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-xs text-yellow-600">Gold I</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-300">
                    <span>65 CS</span>
                    <span className="mx-1">•</span>
                    <span className="text-yellow-500">19.1k gold</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    {isAlly && index === 0 && matchData.items ? (
                      // Hiển thị trang bị của người chơi chính
                      matchData.items.map((item) => (
                        <div key={item.id} className="relative w-5 h-5 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={`Item ${item.id}`}
                            fill
                            className="object-cover rounded-sm"
                          />
                        </div>
                      ))
                    ) : (
                      // Cho các người chơi khác hiển thị trang bị mẫu
                      Array(6).fill(0).map((_, i) => (
                        <div key={i} className={`relative w-5 h-5 ${isAlly ? "bg-gradient-to-br from-blue-500 to-sky-700" : "bg-gradient-to-br from-red-500 to-rose-700"} rounded-sm`}></div>
                      ))
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {renderTeamTable(allyTeam, true)}
      {renderTeamTable(enemyTeam, false)}
    </div>
  );
} 