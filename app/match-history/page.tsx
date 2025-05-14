"use client"

import { useState } from 'react'
import SearchSection from './components/search-section'
import MatchList, { Match } from './components/match-list'
import { fetchMatchHistoryByRiotId } from '@/lib/api'

export default function MatchHistoryPage() {
  const [searchedPlayer, setSearchedPlayer] = useState<{
    gameName: string;
    tagLine: string;
    region: string;
  } | null>(null)
  
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleSearch = async (gameName: string, tagLine: string, region: string) => {
    setLoading(true)
    setError(null)
    setSearchedPlayer({ gameName, tagLine, region })
    
    try {
      // Gọi API để lấy lịch sử đấu
      const matchData = await fetchMatchHistoryByRiotId(gameName, tagLine, 10, region)
      setMatches(matchData)
    } catch (err) {
      console.error('Lỗi khi tải lịch sử đấu:', err)
      setError(err as Error)
      setMatches([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lịch sử đấu</h1>
        <p className="text-gray-400">Xem và phân tích các trận đấu gần đây của bạn trong League of Legends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <SearchSection onSearch={handleSearch} isLoading={loading} />
          </div>
        </div>

        {/* Match List */}
        <div className="lg:col-span-3">
          {searchedPlayer ? (
            <>
              {!loading && !error && matches.length > 0 && (
                <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-4 mb-4">
                  <h2 className="text-xl font-bold">
                    {searchedPlayer.gameName}
                    <span className="text-gray-400 ml-1">#{searchedPlayer.tagLine}</span>
                  </h2>
                  <p className="text-sm text-gray-400">
                    Đã tìm thấy {matches.length} trận đấu gần đây
                  </p>
                </div>
              )}
              <MatchList matches={matches} loading={loading} error={error} />
            </>
          ) : (
            <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center">
              <h2 className="text-xl font-bold text-white mb-4">Chưa có tìm kiếm</h2>
              <p className="text-gray-300">
                Nhập tên và tag của người chơi bên trái để bắt đầu tìm kiếm lịch sử đấu.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}