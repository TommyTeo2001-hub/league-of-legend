"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchChampionsLol, ChampionData } from '@/lib/api'
import { Button } from '@/components/ui/button'

export default function FeaturedChampions() {
  const [champions, setChampions] = useState<ChampionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadChampions = async () => {
      try {
        setLoading(true)
        const response = await fetchChampionsLol(1, 8) // Load first 8 champions
        if (response && response.data && response.data.champions) {
          setChampions(response.data.champions)
        }
      } catch (err) {
        setError('Could not load champion data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadChampions()
  }, [])

  // Function to get champion image URL
  const getChampionImageUrl = (champion: ChampionData) => {
    if (!champion || !champion.image) {
      return '/placeholder-champion.png'
    }
    
    // Using Data Dragon image format
    return `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${champion.image.full}`
  }

  // Map role names to Vietnamese
  const roleMapping: Record<string, string> = {
    "Tank": "Đỡ đòn",
    "Fighter": "Đấu sĩ",
    "Assassin": "Sát thủ",
    "Mage": "Pháp sư",
    "Marksman": "Xạ thủ", 
    "Support": "Hỗ trợ"
  }

  if (loading) {
    return (
      <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 animate-pulse">
        <div className="h-8 w-1/3 bg-[#2a2a30] rounded mb-6"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-[#1a1a1c] rounded-lg aspect-square"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#121214] border border-red-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-2">Error Loading Champions</h2>
        <p className="text-gray-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Các tướng nổi bật</h2>
        <Link href="/champions">
          <Button variant="outline" className="bg-[#1a1a1c] hover:bg-[#2a2a30] border-[#2a2a30]">
            Xem tất cả
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {champions.map(champion => (
          <Link 
            key={champion.id}
            href={`/champions/${champion.id}`}
            className="bg-[#1a1a1c] border border-[#2a2a30] rounded-lg overflow-hidden hover:border-blue-500 transition-colors group"
          >
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={getChampionImageUrl(champion)}
                alt={champion.name}
                fill
                className="object-cover transition-transform group-hover:scale-110 duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1c] to-transparent opacity-70"></div>
            </div>
            <div className="p-3">
              <h3 className="font-medium text-center mb-1">{champion.name}</h3>
              <div className="flex flex-wrap justify-center gap-1">
                {champion.tags?.map(role => (
                  <div key={role} className="text-[0.65rem] text-gray-400 px-1.5 py-0.5 bg-[#121214] rounded">
                    {roleMapping[role] || role}
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 