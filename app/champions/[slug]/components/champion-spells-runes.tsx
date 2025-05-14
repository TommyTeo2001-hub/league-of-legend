"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getRecommendedRunes, getRecommendedSummonerSpells } from '@/lib/champion-utils'
import { GameElementTooltip } from '@/components/ui/tooltip'
import type { RuneRecommendation, SummonerSpell } from '@/lib/champion-utils'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const ImageWithFallback = ({ 
  src, 
  alt, 
  className
}: { 
  src: string; 
  alt: string; 
  className?: string;
}) => {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  if (error) {
    return (
      <div 
        className={cn(
          "bg-blue-800/30 flex items-center justify-center text-xs text-blue-300", 
          className
        )}
      >
        {alt.charAt(0)}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1c] z-10">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      )}
      <img 
        src={src} 
        alt={alt}
        className={className}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true)
          setLoading(false)
        }}
        style={{ opacity: loading ? 0 : 1 }}
      />
    </div>
  )
}

export default function ChampionSpellsRunes({ championData }: { championData: any }) {
  const [runes, setRunes] = useState<RuneRecommendation | null>(null)
  const [spells, setSpells] = useState<SummonerSpell[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRunesAndSpells = async () => {
      try {
        setLoading(true)
        const [runesData, spellsData] = await Promise.all([
          getRecommendedRunes(championData),
          getRecommendedSummonerSpells(championData)
        ])
        setRunes(runesData)
        setSpells(spellsData)
      } catch (error) {
        console.error('Error loading runes and spells:', error)
      } finally {
        setLoading(false)
      }
    }

    if (championData) {
      loadRunesAndSpells()
    }
  }, [championData])

  if (loading) {
    return (
      <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8 animate-pulse">
        <div className="h-6 w-40 bg-[#2a2a30] rounded mb-6"></div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-4 w-32 bg-[#2a2a30] rounded"></div>
            <div className="flex gap-3">
              <div className="h-12 w-12 bg-[#2a2a30] rounded-full"></div>
              <div className="h-12 w-12 bg-[#2a2a30] rounded-full"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 w-32 bg-[#2a2a30] rounded"></div>
            <div className="flex gap-3">
              <div className="h-12 w-12 bg-[#2a2a30] rounded-full"></div>
              <div className="h-12 w-12 bg-[#2a2a30] rounded-full"></div>
              <div className="h-12 w-12 bg-[#2a2a30] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8">
      <h2 className="text-xl font-bold mb-6">Phép Bổ Trợ & Bảng Ngọc Khuyến Nghị</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summoner Spells */}
        <div>
          <h3 className="font-medium text-gray-300 mb-3">Phép Bổ Trợ</h3>
          <div className="flex gap-3">
            {spells.map((spell, index) => (
              <GameElementTooltip
                key={index}
                title={spell.name}
                description={spell.description}
                icon={`spell/${spell.id}.png`}
              >
                <div className="relative w-12 h-12 cursor-help">
                  <ImageWithFallback
                    src={`https://ddragon.leagueoflegends.com/cdn/13.7.1/img/spell/${spell.id}.png`}
                    alt={spell.name}
                    className="rounded-md"
                  />
                </div>
              </GameElementTooltip>
            ))}
          </div>
        </div>
        
        {/* Runes */}
        {runes && (
          <div>
            <h3 className="font-medium text-gray-300 mb-3">Bảng Ngọc</h3>
            <div className="flex flex-col gap-3">
              {/* Primary Path */}
              <div className="flex items-center gap-3">
                <GameElementTooltip
                  title={runes.primary.path.name}
                  description="Đường ngọc chính"
                  icon={runes.primary.path.icon}
                >
                  <div className="relative w-10 h-10 cursor-help">
                    <ImageWithFallback
                      src={`https://ddragon.canisback.com/img/${runes.primary.path.icon}`}
                      alt={runes.primary.path.name}
                      className="rounded-full"
                    />
                  </div>
                </GameElementTooltip>
                
                <GameElementTooltip
                  title={runes.primary.keystone.name}
                  description={runes.primary.keystone.shortDesc}
                  icon={runes.primary.keystone.icon}
                >
                  <div className="relative w-12 h-12 cursor-help border-2 border-yellow-400 rounded-full overflow-hidden">
                    <ImageWithFallback
                      src={`https://ddragon.canisback.com/img/${runes.primary.keystone.icon}`}
                      alt={runes.primary.keystone.name}
                      className="rounded-full"
                    />
                  </div>
                </GameElementTooltip>
                
                {runes.primary.runes.map((rune, index) => (
                  <GameElementTooltip
                    key={index}
                    title={rune.name}
                    description={rune.shortDesc}
                    icon={rune.icon}
                  >
                    <div className="relative w-10 h-10 cursor-help">
                      <ImageWithFallback
                        src={`https://ddragon.canisback.com/img/${rune.icon}`}
                        alt={rune.name}
                        className="rounded-full"
                      />
                    </div>
                  </GameElementTooltip>
                ))}
              </div>
              
              {/* Secondary Path */}
              <div className="flex items-center gap-3 mt-2">
                <GameElementTooltip
                  title={runes.secondary.path.name}
                  description="Đường ngọc phụ"
                  icon={runes.secondary.path.icon}
                >
                  <div className="relative w-10 h-10 cursor-help">
                    <ImageWithFallback
                      src={`https://ddragon.canisback.com/img/${runes.secondary.path.icon}`}
                      alt={runes.secondary.path.name}
                      className="rounded-full"
                    />
                  </div>
                </GameElementTooltip>
                
                {runes.secondary.runes.map((rune, index) => (
                  <GameElementTooltip
                    key={index}
                    title={rune.name}
                    description={rune.shortDesc}
                    icon={rune.icon}
                  >
                    <div className="relative w-10 h-10 cursor-help">
                      <ImageWithFallback
                        src={`https://ddragon.canisback.com/img/${rune.icon}`}
                        alt={rune.name}
                        className="rounded-full"
                      />
                    </div>
                  </GameElementTooltip>
                ))}
              </div>
              
              {/* Stat Shards */}
              <div className="flex items-center gap-3 mt-2">
                <div className="text-xs text-gray-400">Mảnh:</div>
                {runes.shards.map((shard, index) => (
                  <div 
                    key={index}
                    className="px-2 py-1 text-xs bg-[#1a1a1c] rounded text-yellow-300"
                  >
                    {shard}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 