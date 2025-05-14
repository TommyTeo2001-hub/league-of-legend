"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import MatchDetailsModal from './match-details-modal'

type MatchItem = {
  id: number
  image: string
}

type TeamMember = {
  name: string
  champion: string
  image: string
}

export type Match = {
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

type MatchListProps = {
  matches: Match[];
  loading: boolean;
  error: Error | null;
}

export default function MatchList({ matches, loading, error }: MatchListProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-white mb-4">Đang tải...</h2>
          <p className="text-gray-300">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-800/20 border border-red-500 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-4">Lỗi khi tải dữ liệu</h2>
          <p className="text-gray-300 mb-4">
            Không thể tải lịch sử trận đấu. Vui lòng thử lại sau.
          </p>
          <div className="text-sm text-gray-400 font-mono bg-black/30 p-4 rounded-lg text-left">
            {error.message}
          </div>
        </div>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-4">Không có dữ liệu</h2>
          <p className="text-gray-300">
            Không tìm thấy lịch sử trận đấu. Hãy thử tìm kiếm một người chơi khác hoặc kiểm tra lại Riot ID.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div
          key={match.id}
          onClick={() => setSelectedMatch(match)}
          className={`bg-[#121214] border border-[#2a2a30] rounded-xl overflow-hidden cursor-pointer hover:border-blue-500 transition-colors ${
            match.result === 'Victory' ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-red-500'
          }`}
        >
          <div className="p-4">
            <div className="flex items-center gap-6">
              {/* Champion Info */}
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16">
                  <Image
                    src={match.champion.image}
                    alt={match.champion.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div>
                  <Link 
                    href={`/champions/${match.champion.name.toLowerCase()}`}
                    className="font-medium hover:text-blue-400 transition-colors"
                  >
                    {match.champion.name}
                  </Link>
                  <div className="text-sm text-gray-400">{match.role}</div>
                </div>
              </div>

              {/* Match Info */}
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <Badge 
                    className={match.result === 'Victory' ? 'bg-blue-500' : 'bg-red-500'}
                  >
                    {match.result}
                  </Badge>
                  <Badge variant="outline" className="bg-[#1a1a1c] border-[#2a2a30]">
                    {match.gameType}
                  </Badge>
                  <div className="text-sm text-gray-400">{match.duration}</div>
                  <div className="text-sm text-gray-400">{match.timestamp}</div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">KDA</div>
                    <div className="font-medium">{match.kda}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">KDA Ratio</div>
                    <div className="font-medium">{match.kdaRatio}</div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="text-sm text-gray-400 mb-2">Items</div>
                <div className="grid grid-cols-6 gap-1">
                  {match.items && match.items.map((item) => (
                    <div key={item.id} className="relative w-8 h-8">
                      <Image
                        src={item.image}
                        alt="Item"
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team */}
            <div className="mt-4 pt-4 border-t border-[#2a2a30]">
              <div className="text-sm text-gray-400 mb-2">Team</div>
              <div className="flex gap-2">
                {match.team && match.team.map((player) => (
                  <div key={player.name} className="relative w-8 h-8 group">
                    <Image
                      src={player.image}
                      alt={player.champion}
                      fill
                      className="object-cover rounded-full"
                    />
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1a1a1c] text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {player.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      <MatchDetailsModal
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        matchData={selectedMatch}
      />
    </div>
  )
}