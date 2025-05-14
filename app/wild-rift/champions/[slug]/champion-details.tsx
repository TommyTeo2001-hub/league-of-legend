"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Star, Users, ChevronRight } from 'lucide-react'
import RunesSection from './components/runes-section'
import BuildSection from './components/build-section'
import AbilityOrderSection from './components/ability-order-section'
import GameplayTips from './components/gameplay-tips'
import StrengthsWeaknesses from './components/strengths-weaknesses'
import CommentsSection from './components/comments-section'

type ChampionData = {
  name: string
  title: string
  role: string
  difficulty: string
  pickRate: string
  winRate: string
  banRate: string
  patch: string
  matchesScanned: string
  abilities: {
    [key: string]: {
      name: string
      description: string
      icon: string
      cost?: string
      cooldown?: string
      range?: string
    }
  }
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
  skins: Array<{
    name: string
    image: string
    price: number
    releaseDate: string
  }>
  recentSkins: Array<{
    name: string
    image: string
    price: number
    releaseDate: string
    description: string
  }>
  runes: {
    primary: Array<{
      name: string
      icon: string
      category: string
    }>
    secondary: Array<{
      name: string
      icon: string
      category: string
    }>
  }
  summonerSpells: Array<{
    name: string
    icon: string
  }>
  build: {
    starters: Array<{
      name: string
      icon: string
    }>
    coreItems: Array<{
      name: string
      icon: string
    }>
    luxuryItems: Array<{
      name: string
      icon: string
    }>
    boots: Array<{
      name: string
      icon: string
    }>
  }
  abilityOrders: Array<{
    winRate: string
    pickRate: string
    order: {
      passive: {
        name: string
        icon: string
      }
      abilities: Array<{
        key: 'Q' | 'W' | 'E' | 'R'
        name: string
        icon: string
        levels: boolean[]
      }>
    }
  }>
  gameplayTips: {
    laning: string[]
    teamfighting: string[]
    strengths: string[]
    weaknesses: string[]
    relatedChampions: Array<{
      name: string
      image: string
    }>
  }
}

export default function ChampionDetails({ championData }: { championData: any }) {
  const [selectedAbility, setSelectedAbility] = useState('passive')

  const abilityKeys = {
    q: 'Q',
    w: 'W',
    e: 'E',
    r: 'R',
    passive: 'P'
  }

  const abilityVideos = {
    passive: "https://www.youtube.com/embed/example1",
    q: "https://www.youtube.com/embed/example2",
    w: "https://www.youtube.com/embed/example3",
    e: "https://www.youtube.com/embed/example4",
    r: "https://www.youtube.com/embed/example5"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Champion Header */}
      <div className="relative h-[300px] rounded-xl overflow-hidden mb-8">
        <Image
          src="https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg"
          alt={championData.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-blue-600">{championData.role}</Badge>
            <Badge variant="outline" className="bg-[#1a1a1c] border-[#2a2a30]">
              {championData.difficulty}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-1">{championData.name}</h1>
          <p className="text-gray-400">{championData.title}</p>
        </div>
      </div>

      {/* Champion Description */}
      <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg"
            alt={championData.name}
            fill
            className="object-cover opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#121214]/80 to-[#121214]" />
        </div>
        
        <div className="relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-blue-400">Champion Overview</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed mb-4">
                  {championData.name} is a {championData.role.toLowerCase()} champion known for their exceptional ability to control the battlefield and deal devastating damage to enemies. As {championData.title}, they excel in both team fights and solo encounters.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  With a {championData.difficulty.toLowerCase()} difficulty rating, {championData.name} requires precise timing and positioning to maximize their potential. Their unique kit allows them to {championData.role === 'MAGE' ? 'control space and deal burst damage' : championData.role === 'FIGHTER' ? 'engage in close combat while sustaining through fights' : 'provide utility and support for their team'}.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#1a1a1c]/60 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Win Rate</div>
                    <div className="text-xl font-bold text-blue-400">{championData.winRate}</div>
                  </div>
                </div>
                <div className="h-2 bg-[#2a2a30] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: championData.winRate }}
                  />
                </div>
              </div>

              <div className="bg-[#1a1a1c]/60 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Pick Rate</div>
                    <div className="text-xl font-bold text-green-400">{championData.pickRate}</div>
                  </div>
                </div>
                <div className="h-2 bg-[#2a2a30] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-1000"
                    style={{ width: championData.pickRate }}
                  />
                </div>
              </div>

              <div className="bg-[#1a1a1c]/60 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Star className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Ban Rate</div>
                    <div className="text-xl font-bold text-red-400">{championData.banRate}</div>
                  </div>
                </div>
                <div className="h-2 bg-[#2a2a30] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full transition-all duration-1000"
                    style={{ width: championData.banRate }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#121214] border border-[#2a2a30] rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Trophy className="h-4 w-4" />
            Win Rate
          </div>
          <div className="text-2xl font-bold">{championData.winRate}</div>
        </div>
        <div className="bg-[#121214] border border-[#2a2a30] rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Users className="h-4 w-4" />
            Pick Rate
          </div>
          <div className="text-2xl font-bold">{championData.pickRate}</div>
        </div>
        <div className="bg-[#121214] border border-[#2a2a30] rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Star className="h-4 w-4" />
            Ban Rate
          </div>
          <div className="text-2xl font-bold">{championData.banRate}</div>
        </div>
        <div className="bg-[#121214] border border-[#2a2a30] rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Patch {championData.patch}</div>
          <div className="text-2xl font-bold">{championData.matchesScanned}</div>
          <div className="text-xs text-gray-400">matches analyzed</div>
        </div>
      </div>

      {/* Recent Skins Section */}
      {championData.recentSkins && (
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Recent Skins</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {championData.recentSkins.map((skin: any) => (
              <div key={skin.name} className="bg-[#1a1a1c] rounded-lg overflow-hidden group">
                <div className="relative aspect-video">
                  <Image
                    src={skin.image}
                    alt={skin.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-sm px-2 py-1 rounded">
                    {skin.price} WC
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-2">{skin.name}</h4>
                  <p className="text-sm text-gray-400 mb-2">{skin.description}</p>
                  <p className="text-xs text-gray-500">Released: {skin.releaseDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Runes & Spells Section */}
      {championData.runes && championData.summonerSpells && (
        <RunesSection
          primaryRunes={championData.runes.primary}
          secondaryRunes={championData.runes.secondary}
          summonerSpells={championData.summonerSpells}
        />
      )}

      {/* Build Section */}
      {championData.build && (
        <BuildSection
          starters={championData.build.starters}
          coreItems={championData.build.coreItems}
          luxuryItems={championData.build.luxuryItems}
          boots={championData.build.boots}
        />
      )}

      {/* Strengths & Weaknesses Section */}
      {championData.gameplayTips && (
        <StrengthsWeaknesses
          championName={championData.name}
          strengths={championData.gameplayTips.strengths}
          weaknesses={championData.gameplayTips.weaknesses}
        />
      )}

      {/* Ability Order Section */}
      {championData.abilityOrders && (
        <AbilityOrderSection abilityOrders={championData.abilityOrders} />
      )}

      {/* Abilities Section */}
      {championData.abilities && (
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Abilities</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ability Selection */}
            <div className="flex flex-col gap-3">
              {Object.entries(championData.abilities).map(([key, ability]: [string, any]) => (
                <Button
                  key={key}
                  variant="outline"
                  className={`flex items-start gap-4 h-auto p-3 ${
                    selectedAbility === key
                      ? "bg-[#1e2d45] border-blue-500"
                      : "bg-[#1a1a1c] hover:bg-[#2a2a30] border-[#2a2a30]"
                  }`}
                  onClick={() => setSelectedAbility(key)}
                >
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={ability.icon}
                      alt={ability.name}
                      fill
                      className="object-cover rounded-md"
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold bg-[#121214] border border-[#2a2a30] rounded-md">
                      {abilityKeys[key as keyof typeof abilityKeys]}
                    </div>
                  </div>
                  <div className="flex-grow text-left">
                    <div className="font-medium mb-1">{ability.name}</div>
                    <div className="text-sm text-gray-400 line-clamp-1">
                      {ability.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            {/* Ability Details */}
            <div className="bg-[#1a1a1c] rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16">
                  <Image
                    src={championData.abilities[selectedAbility].icon}
                    alt={championData.abilities[selectedAbility].name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div>
                  <div className="text-sm text-blue-400 mb-1">
                    {selectedAbility === 'passive' ? 'PASSIVE' : `${selectedAbility.toUpperCase()} ABILITY`}
                  </div>
                  <h3 className="text-xl font-bold">
                    {championData.abilities[selectedAbility].name}
                  </h3>
                </div>
              </div>

              <div className="space-y-6">
                {/* Ability Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {championData.abilities[selectedAbility].cost && (
                    <div className="bg-[#121214] p-3 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">COST</div>
                      <div className="font-medium">
                        {championData.abilities[selectedAbility].cost}
                      </div>
                    </div>
                  )}
                  {championData.abilities[selectedAbility].range && (
                    <div className="bg-[#121214] p-3 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">RANGE</div>
                      <div className="font-medium">
                        {championData.abilities[selectedAbility].range}
                      </div>
                    </div>
                  )}
                  {championData.abilities[selectedAbility].cooldown && (
                    <div className="bg-[#121214] p-3 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">COOLDOWN</div>
                      <div className="font-medium">
                        {championData.abilities[selectedAbility].cooldown}s
                      </div>
                    </div>
                  )}
                </div>

                {/* Ability Description */}
                <div>
                  <div className="text-sm text-gray-400 mb-2">ABILITY DETAILS</div>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    {championData.abilities[selectedAbility].description}
                  </p>
                  
                  {/* Ability Video */}
                  <div className="mt-4">
                    <div className="text-sm text-gray-400 mb-2">ABILITY PREVIEW</div>
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src={abilityVideos[selectedAbility as keyof typeof abilityVideos]}
                        title={`${championData.abilities[selectedAbility].name} Preview`}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gameplay Tips Section */}
      {championData.gameplayTips && (
        <GameplayTips 
          championName={championData.name}
          laning={championData.gameplayTips.laning}
          teamfighting={championData.gameplayTips.teamfighting}
          strengths={championData.gameplayTips.strengths}
          weaknesses={championData.gameplayTips.weaknesses}
          relatedChampions={championData.gameplayTips.relatedChampions}
        />
      )}

      {/* Counters Section */}
      {championData.counters && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Strong Against */}
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Strong Against</h2>
            <div className="space-y-4">
              {championData.counters.strong.map((champion: any) => (
                <div key={champion.name} className="flex items-center gap-4 bg-[#1a1a1c] p-3 rounded-lg">
                  <div className="relative w-12 h-12">
                    <Image
                      src={champion.image}
                      alt={champion.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">{champion.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-1.5 bg-green-500 rounded-full" style={{ width: `${champion.rating * 10}%` }} />
                      <span className="text-sm text-gray-400">{champion.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Against */}
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Weak Against</h2>
            <div className="space-y-4">
              {championData.counters.weak.map((champion: any) => (
                <div key={champion.name} className="flex items-center gap-4 bg-[#1a1a1c] p-3 rounded-lg">
                  <div className="relative w-12 h-12">
                    <Image
                      src={champion.image}
                      alt={champion.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">{champion.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-1.5 bg-red-500 rounded-full" style={{ width: `${champion.rating * 10}%` }} />
                      <span className="text-sm text-gray-400">{champion.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Skins Section */}
      {championData.skins && (
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Available Skins</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {championData.skins.map((skin: any) => (
              <div key={skin.name} className="bg-[#1a1a1c] rounded-lg overflow-hidden group">
                <div className="relative aspect-video">
                  <Image
                    src={skin.image}
                    alt={skin.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-sm px-2 py-1 rounded">
                    {skin.price} WC
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm mb-1">{skin.name}</h4>
                  <p className="text-xs text-gray-400">Released: {skin.releaseDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <CommentsSection championId={championData.id} />
    </div>
  )
}