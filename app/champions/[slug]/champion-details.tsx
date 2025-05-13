"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Star, Users } from 'lucide-react'
import RunesSection from './components/runes-section'
import BuildSection from './components/build-section'
import AbilityOrderSection from './components/ability-order-section'
import CommentsSection from './components/comments-section'

// Define the champion data interface with proper optional fields
type ChampionData = {
  id?: string
  name: string
  title: string
  role: string
  difficulty: string
  img?: string
  image?: string
  stats?: Record<string, number>
  pickRate: string
  winRate: string
  banRate: string
  patch: string
  matchesScanned: string
  abilities?: {
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
  skins?: Array<{
    name: string
    image: string
    price: number
    releaseDate: string
  }>
  runes: {
    primary: Array<{
      name: string
      icon: string
      category: string
      winRate: string
      pickRate: string
    }>
    secondary: Array<{
      name: string
      icon: string
      category: string
      winRate: string
      pickRate: string
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
}

export default function ChampionDetails({ championData: rawChampionData }: { championData: ChampionData }) {
  const [selectedAbility, setSelectedAbility] = useState('passive')
  const [championData, setChampionData] = useState<ChampionData | null>(null)
  
  // Process and normalize champion data
  useEffect(() => {
    if (rawChampionData) {
      const processedData = { ...rawChampionData }
      
      // Default image URLs
      const defaultImage = 'https://ddragon.leagueoflegends.com/cdn/13.7.1/img/champion/Aatrox.png'
      const defaultSplash = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg'
      
      // Ensure abilities exist and have proper format
      if (!processedData.abilities || Object.keys(processedData.abilities).length === 0) {
        const abilityIcon = processedData.image || defaultImage
        
        processedData.abilities = {
          passive: {
            name: 'Passive',
            description: 'Passive ability description not available',
            icon: abilityIcon,
            cost: 'Passive',
            cooldown: 'N/A',
            range: 'N/A'
          },
          q: {
            name: 'Q Ability',
            description: 'Q ability description not available',
            icon: abilityIcon,
            cost: 'Unknown',
            cooldown: '0',
            range: '0'
          },
          w: {
            name: 'W Ability',
            description: 'W ability description not available',
            icon: abilityIcon,
            cost: 'Unknown',
            cooldown: '0',
            range: '0'
          },
          e: {
            name: 'E Ability',
            description: 'E ability description not available',
            icon: abilityIcon,
            cost: 'Unknown',
            cooldown: '0',
            range: '0'
          },
          r: {
            name: 'Ultimate (R)',
            description: 'Ultimate ability description not available',
            icon: abilityIcon,
            cost: 'Unknown',
            cooldown: '0',
            range: '0'
          }
        }
      }
      
      // Ensure runes have win and pick rates
      if (processedData.runes) {
        processedData.runes.primary = processedData.runes.primary.map(rune => ({
          ...rune,
          winRate: rune.winRate || '50%',
          pickRate: rune.pickRate || '10%'
        }))
        
        processedData.runes.secondary = processedData.runes.secondary.map(rune => ({
          ...rune,
          winRate: rune.winRate || '50%',
          pickRate: rune.pickRate || '10%'
        }))
      }
      
      // Ensure skins exist
      if (!processedData.skins || processedData.skins.length === 0) {
        processedData.skins = [{
          name: 'Default',
          image: processedData.img || processedData.image || defaultSplash,
          price: 0,
          releaseDate: 'N/A'
        }]
      }
      
      setChampionData(processedData)
    }
  }, [rawChampionData])
  
  // Ability key mapping for display
  const abilityKeys = {
    q: 'Q',
    w: 'W',
    e: 'E',
    r: 'R',
    passive: 'P'
  }
  
  console.log("championData: ", championData)
  
  // Show loading state if data is not processed yet
  if (!championData) {
    return <div className="container mx-auto px-4 py-8">Loading champion data...</div>
  }
  
  // Helper to safely access abilities
  const getAbility = (key: string) => {
    if (!championData.abilities || !championData.abilities[key]) {
      return {
        name: `${key.toUpperCase()} Ability`,
        description: 'No description available',
        icon: championData.image || 'https://ddragon.leagueoflegends.com/cdn/13.7.1/img/champion/Aatrox.png'
      }
    }
    return championData.abilities[key]
  }
  
  // Helper to get champion image
  const getChampionImage = () => {
    if (championData.skins && championData.skins.length > 0) {
      return championData.skins[0].image
    }
    if (championData.img) {
      return championData.img
    }
    if (championData.image) {
      return championData.image
    }
    return 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Champion Header */}
      <div className="relative h-[300px] rounded-xl overflow-hidden mb-8">
        <Image
          src={getChampionImage()}
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

      {/* Champion Stats Section */}
      {championData.stats && (
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Thông số tướng</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Base Stats */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-400">Chỉ số cơ bản</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Máu</span>
                  <span>{championData.stats.hp || championData.stats.health || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Năng lượng</span>
                  <span>{championData.stats.mp || championData.stats.mana || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Giáp</span>
                  <span>{championData.stats.armor || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Kháng phép</span>
                  <span>{championData.stats.spellblock || championData.stats.magicResist || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tốc độ di chuyển</span>
                  <span>{championData.stats.movespeed || 0}</span>
                </div>
              </div>
            </div>
            
            {/* Attack Stats */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-400">Chỉ số tấn công</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Sát thương</span>
                  <span>{championData.stats.attackdamage || championData.stats.attackDamage || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tốc độ đánh</span>
                  <span>{championData.stats.attackspeed || championData.stats.attackSpeed || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tầm đánh</span>
                  <span>{championData.stats.attackrange || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Chí mạng</span>
                  <span>{championData.stats.crit || 0}%</span>
                </div>
              </div>
            </div>
            
            {/* Growth Stats */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-400">Tăng trưởng mỗi cấp</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Máu</span>
                  <span>+{championData.stats.hpperlevel || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Năng lượng</span>
                  <span>+{championData.stats.mpperlevel || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Giáp</span>
                  <span>+{championData.stats.armorperlevel || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Kháng phép</span>
                  <span>+{championData.stats.spellblockperlevel || 0}</span>
                </div>
              </div>
            </div>
            
            {/* Regeneration Stats */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-400">Hồi phục</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Hồi máu</span>
                  <span>{championData.stats.hpregen || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Hồi máu/cấp</span>
                  <span>+{championData.stats.hpregenperlevel || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Hồi năng lượng</span>
                  <span>{championData.stats.mpregen || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Hồi năng lượng/cấp</span>
                  <span>+{championData.stats.mpregenperlevel || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tăng tốc độ đánh/cấp</span>
                  <span>+{championData.stats.attackspeedperlevel || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Runes & Spells Section */}
      <RunesSection
        primaryRunes={championData.runes.primary}
        secondaryRunes={championData.runes.secondary}
        summonerSpells={championData.summonerSpells}
      />

      {/* Build Section */}
      <BuildSection
        starters={championData.build.starters}
        coreItems={championData.build.coreItems}
        luxuryItems={championData.build.luxuryItems}
        boots={championData.build.boots}
      />

      {/* Ability Order Section */}
      <AbilityOrderSection abilityOrders={championData.abilityOrders} />

      {/* Abilities Section */}
      <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Abilities</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ability Selection */}
          <div className="flex flex-col gap-3">
            {championData.abilities && Object.entries(championData.abilities).map(([key, ability]) => (
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
                  src={getAbility(selectedAbility).icon}
                  alt={getAbility(selectedAbility).name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <div className="text-sm text-blue-400 mb-1">
                  {selectedAbility === 'passive' ? 'PASSIVE' : `${selectedAbility.toUpperCase()} ABILITY`}
                </div>
                <h3 className="text-xl font-bold">
                  {getAbility(selectedAbility).name}
                </h3>
              </div>
            </div>

            <div className="space-y-6">
              {/* Ability Stats */}
              <div className="grid grid-cols-3 gap-3">
                {getAbility(selectedAbility).cost && (
                  <div className="bg-[#121214] p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">COST</div>
                    <div className="font-medium">
                      {getAbility(selectedAbility).cost}
                    </div>
                  </div>
                )}
                {getAbility(selectedAbility).range && (
                  <div className="bg-[#121214] p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">RANGE</div>
                    <div className="font-medium">
                      {getAbility(selectedAbility).range}
                    </div>
                  </div>
                )}
                {getAbility(selectedAbility).cooldown && (
                  <div className="bg-[#121214] p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">COOLDOWN</div>
                    <div className="font-medium">
                      {getAbility(selectedAbility).cooldown}s
                    </div>
                  </div>
                )}
              </div>

              {/* Ability Description */}
              <div>
                <div className="text-sm text-gray-400 mb-2">ABILITY DETAILS</div>
                <p className="text-gray-200 leading-relaxed">
                  {getAbility(selectedAbility).description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Counters Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Strong Against */}
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Strong Against</h2>
          <div className="space-y-4">
            {championData.counters.strong.length > 0 ? 
              championData.counters.strong.map((champion) => (
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
              )) : (
                <div className="text-gray-400 text-center py-4">No data available</div>
              )
            }
          </div>
        </div>

        {/* Weak Against */}
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Weak Against</h2>
          <div className="space-y-4">
            {championData.counters.weak.length > 0 ? 
              championData.counters.weak.map((champion) => (
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
              )) : (
                <div className="text-gray-400 text-center py-4">No data available</div>
              )
            }
          </div>
        </div>
      </div>

      {/* Skins Section */}
      {championData.skins && championData.skins.length > 0 && (
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Available Skins</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {championData.skins.map((skin) => (
              <div key={skin.name} className="bg-[#1a1a1c] rounded-lg overflow-hidden group">
                <div className="relative aspect-video">
                  <Image
                    src={skin.image}
                    alt={skin.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-sm px-2 py-1 rounded">
                    {skin.price} RP
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