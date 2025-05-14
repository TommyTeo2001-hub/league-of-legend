"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Star, Users, Info, AlertTriangle, BookOpen, Sparkles, ArrowUp } from 'lucide-react'
import BuildSection from './components/build-section'
import AbilityOrderSection from './components/ability-order-section'
import CommentsSection from './components/comments-section'
import SkinsSection from './components/skins-section'
import ChampionSpellsRunes from './components/champion-spells-runes'
import { FrontendChampion } from '@/lib/champions-utils'

// Define the extended ability interface with all properties from Dragon API
interface AbilityDetail {
  name: string;
  description: string;
  icon: string;
  cost?: string;
  cooldown?: string;
  range?: string;
  tooltip?: string;
  cooldownBurn?: string;
  costBurn?: string;
  rangeBurn?: string;
  resource?: string;
  maxrank?: number;
  leveltip?: {
    label: string[];
    effect: string[];
  };
  cooldownArray?: number[];
  costArray?: number[];
  rangeArray?: number[];
  effectValues?: Array<number[]>;
  effectBurn?: string[];
  vars?: Array<{
    key: string;
    link: string;
    coeff: number | number[];
  }>;
  costType?: string;
  maxammo?: number;
  ammorechargetime?: number;
  damage?: {
    type: string;
    scaling: string[];
    values: number[][];
  };
}

// Extend the champion data interface with updated abilities type
interface ChampionData extends Omit<FrontendChampion, 'abilities'> {
  abilities: {
    [key: string]: AbilityDetail;
  };
}

export default function ChampionDetails({ championData: rawChampionData }: { championData: ChampionData }) {
  const [selectedAbility, setSelectedAbility] = useState('passive')
  const [championData, setChampionData] = useState<ChampionData | null>(null)

  // Process and normalize champion data
  useEffect(() => {
    if (rawChampionData) {
      const processedData = { ...rawChampionData }
      
      // Default image URLs
      const defaultImage = 'https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/Aatrox.png'
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
        icon: championData.image || 'https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/Aatrox.png'
      }
    }
    return championData.abilities[key]
  }
  
  // Helper to get champion image
  const getChampionImage = () => {
    if (championData.img) {
      return championData.img
    }
    if (championData.image) {
      return championData.image
    }
    if (championData.skins && championData.skins.length > 0) {
      return championData.skins[0].image
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
            {championData.partype && (
              <Badge variant="outline" className="bg-[#1a1a1c] border-[#2a2a30]">
                {championData.partype}
              </Badge>
            )}
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

      {/* Lore Section */}
      {championData.lore && (
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            Cốt truyện
          </h2>
          <p className="text-gray-300 leading-relaxed">{championData.lore}</p>
        </div>
      )}

      {/* Tips Section */}
      {(championData.allytips?.length || championData.enemytips?.length) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Ally Tips */}
          {championData.allytips && championData.allytips.length > 0 && (
            <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-400" />
                Mẹo khi chơi {championData.name}
              </h2>
              <ul className="space-y-3">
                {championData.allytips.map((tip, index) => (
                  <li key={index} className="flex gap-2 text-gray-300">
                    <span className="text-blue-400 flex-shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Enemy Tips */}
          {championData.enemytips && championData.enemytips.length > 0 && (
            <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                Mẹo khi đối đầu với {championData.name}
              </h2>
              <ul className="space-y-3">
                {championData.enemytips.map((tip, index) => (
                  <li key={index} className="flex gap-2 text-gray-300">
                    <span className="text-red-400 flex-shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

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

      {/* Skin Gallery Section */}
      {championData.skins && championData.skins.length > 1 && (
        <SkinsSection 
          skins={championData.skins} 
          championName={championData.name} 
        />
      )}

      {/* Runes & Spells Section */}
      <ChampionSpellsRunes championData={championData} />

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
        <h2 className="text-2xl font-bold mb-6">Kỹ năng</h2>
        
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
                    {abilityKeys[key as keyof typeof abilityKeys] || key.toUpperCase()}
                  </div>
                  
                  {/* Add damage type indicator */}
                  {ability.damage?.type && key !== 'passive' && (
                    <div 
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border ${
                        ability.damage.type === 'physical' 
                          ? 'bg-red-800 border-red-600' 
                          : ability.damage.type === 'magic' 
                            ? 'bg-purple-800 border-purple-600'
                            : ability.damage.type === 'true'
                              ? 'bg-white/30 border-white/70'
                              : 'bg-orange-800 border-orange-600'
                      }`}
                    />
                  )}
                </div>
                
                <div className="text-left flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{ability.name}</h3>
                    
                    {/* Show max rank for non-passive abilities */}
                    {key !== 'passive' && ability.maxrank && (
                      <span className="text-xs text-gray-400 ml-1">
                        Tối đa {ability.maxrank}
                      </span>
                    )}
                  </div>
                  
                  {/* Display key ability info in a small grid */}
                  {key !== 'passive' && (
                    <div className="grid grid-cols-3 gap-1 mt-2 text-xs">
                      <div>
                        <span className="text-gray-500">Hồi chiêu:</span>{' '}
                        <span className="text-blue-400">{ability.cooldownBurn || ability.cooldown}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Chi phí:</span>{' '}
                        <span className="text-purple-400">{ability.costBurn || ability.cost}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Tầm:</span>{' '}
                        <span className="text-yellow-400">{ability.rangeBurn || ability.range}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>
          
          {/* Ability Details */}
          <div className="bg-[#1a1a1c] border border-[#2a2a30] rounded-xl p-5">
            {selectedAbility && championData.abilities && championData.abilities[selectedAbility] && (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={championData.abilities[selectedAbility].icon}
                      alt={championData.abilities[selectedAbility].name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-blue-400 font-medium mb-1">
                      {selectedAbility === 'passive' ? 'NỘI TẠI' : `KỸ NĂNG ${selectedAbility.toUpperCase()}`}
                    </div>
                    <h3 className="text-xl font-bold">{championData.abilities[selectedAbility].name}</h3>
                    {championData.abilities[selectedAbility].maxrank && selectedAbility !== 'passive' && (
                      <div className="text-xs text-gray-400 mt-1">
                        Tối đa {championData.abilities[selectedAbility].maxrank} cấp
                      </div>
                    )}
                    
                    {/* Display damage type indicator if available */}
                    {championData.abilities[selectedAbility].damage?.type && (
                      <div className="mt-1">
                        <Badge 
                          className={`
                            ${championData.abilities[selectedAbility].damage.type === 'physical' 
                              ? 'bg-red-800/30 text-red-300 border-red-700/50' 
                              : championData.abilities[selectedAbility].damage.type === 'magic' 
                                ? 'bg-purple-800/30 text-purple-300 border-purple-700/50'
                                : championData.abilities[selectedAbility].damage.type === 'true'
                                  ? 'bg-white/10 text-white border-white/30'
                                  : 'bg-orange-800/30 text-orange-300 border-orange-700/50'
                            }
                          `}
                        >
                          {championData.abilities[selectedAbility].damage.type === 'physical' 
                            ? 'Sát thương vật lý' 
                            : championData.abilities[selectedAbility].damage.type === 'magic' 
                              ? 'Sát thương phép thuật'
                              : championData.abilities[selectedAbility].damage.type === 'true'
                                ? 'Sát thương chuẩn'
                                : 'Sát thương hỗn hợp'
                          }
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Basic description */}
                  <div className="text-gray-300 text-sm leading-relaxed" 
                       dangerouslySetInnerHTML={{ __html: championData.abilities[selectedAbility].description }}/>
                  
                  {/* Detailed tooltip if available */}
                  {championData.abilities[selectedAbility].tooltip && (
                    <div className="bg-[#0f0f12] p-3 rounded-md text-sm text-gray-300 leading-relaxed">
                      <div className="mb-2 text-blue-400 font-medium">Chi tiết kỹ năng:</div>
                      <div dangerouslySetInnerHTML={{ 
                        __html: championData.abilities[selectedAbility].tooltip
                      }} />
                    </div>
                  )}

                  {/* Ability stats grid */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#121214] rounded-md p-2">
                      <div className="text-xs text-gray-400 mb-1">Hồi chiêu</div>
                      <div className="font-medium">
                        {championData.abilities[selectedAbility].cooldownBurn || championData.abilities[selectedAbility].cooldown || 'N/A'}
                      </div>
                      {championData.abilities[selectedAbility].maxammo && (
                        <div className="text-xs text-gray-400 mt-1">
                          Tối đa: {championData.abilities[selectedAbility].maxammo} lần
                        </div>
                      )}
                    </div>
                    <div className="bg-[#121214] rounded-md p-2">
                      <div className="text-xs text-gray-400 mb-1">Tiêu hao</div>
                      <div className="font-medium">
                        {championData.abilities[selectedAbility].costBurn || championData.abilities[selectedAbility].cost || 'N/A'}
                      </div>
                      {championData.abilities[selectedAbility].resource && (
                        <div className="text-xs text-gray-500 mt-1">
                          {championData.abilities[selectedAbility].resource}
                        </div>
                      )}
                    </div>
                    <div className="bg-[#121214] rounded-md p-2">
                      <div className="text-xs text-gray-400 mb-1">Tầm sử dụng</div>
                      <div className="font-medium">
                        {championData.abilities[selectedAbility].rangeBurn || championData.abilities[selectedAbility].range || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Ability scaling per level in table format */}
                  {championData.abilities[selectedAbility].leveltip && 
                   championData.abilities[selectedAbility].leveltip.label && 
                   championData.abilities[selectedAbility].leveltip.label.length > 0 && 
                   selectedAbility !== 'passive' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left rounded-lg overflow-hidden">
                        <thead className="text-xs bg-[#121214] text-gray-400">
                          <tr>
                            <th className="px-3 py-2">Thuộc tính</th>
                            {championData.abilities[selectedAbility].maxrank && 
                              Array.from({length: championData.abilities[selectedAbility].maxrank}, (_, i) => (
                                <th key={i} className="px-3 py-2 text-center">Cấp {i+1}</th>
                              ))
                            }
                          </tr>
                        </thead>
                        <tbody>
                          {championData.abilities[selectedAbility].leveltip.label.map((label, idx) => {
                            // Parse effect data if possible
                            const effectStr = championData.abilities[selectedAbility].leveltip?.effect[idx] || '';
                            let effectValues: string[] = [];
                            
                            // Handle different effect formats
                            if (effectStr.includes('->')) {
                              // Format like "100->150->200->250->300"
                              effectValues = effectStr.split('->');
                            } else if (effectStr.includes('/')) {
                              // Format like "100/150/200/250/300"
                              effectValues = effectStr.split('/');
                            } else {
                              // Just show the original string
                              effectValues = [effectStr];
                            }
                            
                            return (
                              <tr key={idx} className="border-b border-[#2a2a30] bg-[#0f0f12]">
                                <td className="px-3 py-2 font-medium text-gray-300">{label}</td>
                                {championData.abilities[selectedAbility].maxrank && 
                                  Array.from({length: championData.abilities[selectedAbility].maxrank}, (_, i) => (
                                    <td key={i} className="px-3 py-2 text-center text-green-400">
                                      {effectValues[i] || '-'}
                                    </td>
                                  ))
                                }
                              </tr>
                            );
                          })}
                          
                          {/* Show cooldown per level if available */}
                          {championData.abilities[selectedAbility].cooldownArray && 
                           championData.abilities[selectedAbility].cooldownArray.length > 1 && 
                           !championData.abilities[selectedAbility].leveltip?.label.some(label => 
                             label.toLowerCase().includes('hồi chiêu') || label.toLowerCase().includes('cooldown')
                           ) && (
                            <tr className="border-b border-[#2a2a30] bg-[#0f0f12]">
                              <td className="px-3 py-2 font-medium text-gray-300">Hồi chiêu</td>
                              {championData.abilities[selectedAbility].cooldownArray.map((cd, i) => (
                                <td key={i} className="px-3 py-2 text-center text-blue-400">{cd}s</td>
                              ))}
                            </tr>
                          )}
                          
                          {/* Show cost per level if available */}
                          {championData.abilities[selectedAbility].costArray && 
                           championData.abilities[selectedAbility].costArray.length > 1 && 
                           !championData.abilities[selectedAbility].leveltip?.label.some(label => 
                             label.toLowerCase().includes('chi phí') || label.toLowerCase().includes('cost')
                           ) && 
                           !(championData.abilities[selectedAbility].costArray).every((c: number) => c === 0) && (
                            <tr className="bg-[#0f0f12]">
                              <td className="px-3 py-2 font-medium text-gray-300">Chi phí</td>
                              {championData.abilities[selectedAbility].costArray.map((cost, i) => (
                                <td key={i} className="px-3 py-2 text-center text-purple-400">{cost}</td>
                              ))}
                            </tr>
                          )}
                          
                          {/* Show range per level if available and changes */}
                          {championData.abilities[selectedAbility].rangeArray && 
                           championData.abilities[selectedAbility].rangeArray.length > 1 && 
                           // Only show if range changes between levels
                           new Set(championData.abilities[selectedAbility].rangeArray).size > 1 && 
                           !championData.abilities[selectedAbility].leveltip?.label.some(label => 
                             label.toLowerCase().includes('tầm') || label.toLowerCase().includes('range')
                           ) && (
                            <tr className="bg-[#0f0f12] border-b border-[#2a2a30]">
                              <td className="px-3 py-2 font-medium text-gray-300">Tầm sử dụng</td>
                              {championData.abilities[selectedAbility].rangeArray.map((range, i) => (
                                <td key={i} className="px-3 py-2 text-center text-yellow-400">{range}</td>
                              ))}
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {/* Show additional effects from vars if available */}
                  {championData.abilities[selectedAbility].vars && 
                   championData.abilities[selectedAbility].vars.length > 0 && (
                    <div className="mt-3 p-3 bg-[#0f0f12] rounded-md">
                      <h4 className="text-sm font-medium text-blue-400 mb-2">Tỉ lệ tăng sức mạnh:</h4>
                      <ul className="space-y-1 text-sm">
                        {championData.abilities[selectedAbility].vars.map((v, idx) => {
                          let scalingType = '';
                          let scalingClass = '';
                          
                          // Determine scaling type
                          if (v.link.includes('attackdamage')) {
                            scalingType = 'Sát thương vật lý';
                            scalingClass = 'text-red-400';
                          } else if (v.link.includes('spelldamage')) {
                            scalingType = 'Sức mạnh phép thuật';
                            scalingClass = 'text-purple-400';
                          } else if (v.link.includes('bonushealth')) {
                            scalingType = 'Máu bổ sung';
                            scalingClass = 'text-green-400';
                          } else if (v.link.includes('health')) {
                            scalingType = 'Máu';
                            scalingClass = 'text-green-400';
                          } else if (v.link.includes('armor')) {
                            scalingType = 'Giáp';
                            scalingClass = 'text-yellow-400';
                          } else if (v.link.includes('bonusmana')) {
                            scalingType = 'Năng lượng bổ sung';
                            scalingClass = 'text-blue-400';
                          } else {
                            scalingType = v.link;
                            scalingClass = 'text-gray-300';
                          }
                          
                          // Format the coefficient
                          let coeffText = '';
                          if (Array.isArray(v.coeff)) {
                            coeffText = v.coeff.join('/');
                          } else {
                            coeffText = v.coeff.toString();
                          }
                          
                          return (
                            <li key={idx} className="flex items-center gap-2">
                              <span className={`font-semibold ${scalingClass}`}>+{coeffText}</span>
                              <span className="text-gray-300">{scalingType}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <CommentsSection championId={championData.id} />
    </div>
  )
}