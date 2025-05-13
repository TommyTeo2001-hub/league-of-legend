"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Star, Users } from 'lucide-react'
import CommentsSection from './components/comments-section'

type ChampionData = {
  id: string
  name: string
  title: string
  cost: number
  traits: string[]
  image: string
  stats: {
    health: number
    mana: number
    armor: number
    magicResist: number
    attackDamage: number
    attackSpeed: number
  }
}

export default function ChampionDetails({ championData }: { championData: ChampionData }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Champion Header */}
      <div className="relative h-[300px] rounded-xl overflow-hidden mb-8">
        <Image
          src={championData.image}
          alt={championData.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-yellow-600">Cost {championData.cost}</Badge>
            {championData.traits.map(trait => (
              <Badge key={trait} variant="outline" className="bg-[#1a1a1c] border-[#2a2a30]">
                {trait}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl font-bold mb-1">{championData.name}</h1>
          <p className="text-gray-400">{championData.title}</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Champion Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-[#1a1a1c] rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Health</div>
            <div className="text-2xl font-bold">{championData.stats.health}</div>
          </div>
          <div className="bg-[#1a1a1c] rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Mana</div>
            <div className="text-2xl font-bold">{championData.stats.mana}</div>
          </div>
          <div className="bg-[#1a1a1c] rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Armor</div>
            <div className="text-2xl font-bold">{championData.stats.armor}</div>
          </div>
          <div className="bg-[#1a1a1c] rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Magic Resist</div>
            <div className="text-2xl font-bold">{championData.stats.magicResist}</div>
          </div>
          <div className="bg-[#1a1a1c] rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Attack Damage</div>
            <div className="text-2xl font-bold">{championData.stats.attackDamage}</div>
          </div>
          <div className="bg-[#1a1a1c] rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Attack Speed</div>
            <div className="text-2xl font-bold">{championData.stats.attackSpeed}</div>
          </div>
        </div>
      </div>

      {/* Traits Section */}
      <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Traits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {championData.traits.map((trait) => (
            <div key={trait} className="bg-[#1a1a1c] rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">{trait}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <Image
                      src={championData.image}
                      alt={trait}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Trait Bonus</div>
                    <div className="text-sm text-gray-400">
                      Placeholder text for {trait} trait bonus description
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <CommentsSection />
    </div>
  )
}