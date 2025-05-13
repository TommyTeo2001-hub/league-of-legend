"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const champions = [
  {
    id: 'gnar',
    name: "Gnar",
    image: "https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg",
    cost: 2,
    traits: ["Freljord", "Shapeshifter"],
    difficulty: "Moderate"
  },
  {
    id: 'lucian',
    name: "Lucian",
    image: "https://images.pexels.com/photos/7915264/pexels-photo-7915264.jpeg",
    cost: 3,
    traits: ["Gunner", "Sentinel"],
    difficulty: "Easy"
  },
  {
    id: 'miss-fortune',
    name: "Miss Fortune",
    image: "https://images.pexels.com/photos/6498853/pexels-photo-6498853.jpeg",
    cost: 4,
    traits: ["Gunner", "Fortune"],
    difficulty: "Moderate"
  }
]

export default function TFTChampionsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredChampions = champions.filter(champion =>
    champion.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">TFT Champions</h1>
        <p className="text-gray-400">Browse all Teamfight Tactics champions and their builds</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search champions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1a1a1c] border-[#2a2a30] focus-visible:ring-blue-500"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Champions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredChampions.map((champion) => (
          <Link
            key={champion.id}
            href={`/tft/champions/${champion.id}`}
            className="bg-[#121214] border border-[#2a2a30] rounded-lg overflow-hidden hover:border-blue-500 transition-colors group"
          >
            <div className="relative aspect-square">
              <Image
                src={champion.image}
                alt={champion.name}
                fill
                className="object-cover transition-transform group-hover:scale-110 duration-500"
              />
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 flex items-center justify-center bg-yellow-600 rounded-full text-sm font-bold">
                  {champion.cost}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#121214] to-transparent" />
            </div>
            <div className="p-3">
              <h3 className="font-medium text-center mb-2">{champion.name}</h3>
              <div className="flex flex-wrap justify-center gap-1">
                {champion.traits.map((trait) => (
                  <Badge
                    key={trait}
                    variant="outline"
                    className="text-[0.65rem] bg-[#1a1a1c] border-[#2a2a30]"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}