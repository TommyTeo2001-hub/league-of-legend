"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { fetchCounters } from '@/lib/api'

type CounterData = {
  champion: string
  win_rate: number
  counter_tips: string[]
}

type ChampionData = {
  id: string
  name: string
  image: string
  role: string
  difficulty: string
  counters: {
    strong: Array<{
      name: string
      rating: number
      image: string
    }>
    weak: Array<{
      name: string
      rating: number
      image: string
    }>
  }
}

export default function CountersClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [champions, setChampions] = useState<ChampionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchCounters()
        
        if (data && Array.isArray(data.champions)) {
          setChampions(data.champions)
        } else if (data && typeof data === 'object') {
          const championsArray = Object.keys(data).map(key => ({
            id: key,
            name: data[key].name || key,
            image: data[key].image || "https://via.placeholder.com/150",
            role: data[key].role || "Unknown",
            difficulty: data[key].difficulty || "Normal",
            counters: data[key].counters || { strong: [], weak: [] }
          }));
          setChampions(championsArray);
        } else {
          setChampions([]);
          console.warn('Dữ liệu không đúng định dạng:', data);
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu counter:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredChampions = champions.filter(champion =>
    champion.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Đang tải...</h2>
          <p className="text-gray-300">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-800/20 border border-red-500 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Lỗi khi tải dữ liệu</h2>
          <p className="text-gray-300 mb-4">
            Không thể tải thông tin counter. Vui lòng thử lại sau.
          </p>
          <div className="text-sm text-gray-400 font-mono bg-black/30 p-4 rounded-lg text-left">
            {error.message}
          </div>
        </div>
      </div>
    )
  }

  if (champions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Không có dữ liệu</h2>
          <p className="text-gray-300">
            Hiện không có thông tin về champion counters nào.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Champion Counters</h1>
        <p className="text-gray-400">Tìm kiếm counter tốt nhất cho mỗi tướng trong League of Legends</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Tìm kiếm tướng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1a1a1c] border-[#2a2a30] focus-visible:ring-blue-500"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {filteredChampions.length === 0 && (
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-4">Không tìm thấy kết quả</h2>
          <p className="text-gray-300">
            Không tìm thấy champion phù hợp với từ khóa &ldquo;{searchQuery}&rdquo;.
          </p>
        </div>
      )}

      {/* Champions Grid */}
      {filteredChampions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChampions.map((champion) => (
            <Link
              key={champion.id || champion.name}
              href={`/counters/${(champion.id || champion.name).toLowerCase()}`}
              className="bg-[#121214] border border-[#2a2a30] rounded-xl overflow-hidden hover:border-blue-500 transition-colors"
            >
              <div className="relative h-48">
                <Image
                  src={champion.image}
                  alt={champion.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121214] to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-600">{champion.role}</Badge>
                    <Badge variant="outline" className="bg-[#1a1a1c] border-[#2a2a30]">
                      {champion.difficulty}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold">{champion.name}</h3>
                </div>
              </div>

              <div className="p-4">
                {/* Strong Against */}
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-2">Khắc Chế</div>
                  {champion.counters && champion.counters.strong && champion.counters.strong.length > 0 ? (
                    <div className="flex items-center gap-2">
                      {champion.counters.strong.slice(0, 2).map((counter) => (
                        <div key={counter.name} className="flex items-center gap-2 bg-[#1a1a1c] rounded-lg p-2">
                          <div className="relative w-8 h-8">
                            <Image
                              src={counter.image}
                              alt={counter.name}
                              fill
                              className="object-cover rounded-full"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{counter.name}</div>
                            <div className="text-xs text-green-400">{counter.rating.toFixed(1)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Không có dữ liệu</div>
                  )}
                </div>

                {/* Weak Against */}
                <div>
                  <div className="text-sm text-gray-400 mb-2">Bị Khắc Chế</div>
                  {champion.counters && champion.counters.weak && champion.counters.weak.length > 0 ? (
                    <div className="flex items-center gap-2">
                      {champion.counters.weak.slice(0, 2).map((counter) => (
                        <div key={counter.name} className="flex items-center gap-2 bg-[#1a1a1c] rounded-lg p-2">
                          <div className="relative w-8 h-8">
                            <Image
                              src={counter.image}
                              alt={counter.name}
                              fill
                              className="object-cover rounded-full"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{counter.name}</div>
                            <div className="text-xs text-red-400">{counter.rating.toFixed(1)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Không có dữ liệu</div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 