import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

type RuneData = {
  name: string
  icon: string
  winRate: string
  pickRate: string
  category: string
}

type RunesSectionProps = {
  primaryRunes: RuneData[]
  secondaryRunes: RuneData[]
  summonerSpells: {
    name: string
    icon: string
  }[]
}

export default function RunesSection({ primaryRunes, secondaryRunes, summonerSpells }: RunesSectionProps) {
  return (
    <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Runes & Spells</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-[#1a1a1c] border-[#2a2a30]">
            Win Rate: 55%
          </Badge>
          <Badge variant="outline" className="bg-[#1a1a1c] border-[#2a2a30]">
            Pick Rate: 55%
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Runes */}
        <div>
          <div className="text-sm text-gray-400 mb-3">RESOLVE</div>
          <div className="grid grid-cols-5 gap-2">
            {primaryRunes.map((rune, index) => (
              <div 
                key={rune.name}
                className={`relative aspect-square rounded-lg overflow-hidden ${
                  index === 0 ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <Image
                  src={rune.icon}
                  alt={rune.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Runes */}
        <div>
          <div className="text-sm text-gray-400 mb-3">DOMINATION</div>
          <div className="grid grid-cols-3 gap-2">
            {secondaryRunes.map((rune) => (
              <div 
                key={rune.name}
                className="relative aspect-square rounded-lg overflow-hidden"
              >
                <Image
                  src={rune.icon}
                  alt={rune.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            ))}
          </div>
        </div>

        {/* Summoner Spells */}
        <div>
          <div className="text-sm text-gray-400 mb-3">SUMMONER SPELLS</div>
          <div className="grid grid-cols-2 gap-4">
            {summonerSpells.map((spell) => (
              <div key={spell.name} className="bg-[#1a1a1c] rounded-lg p-3">
                <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                  <Image
                    src={spell.icon}
                    alt={spell.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-sm font-medium text-center">{spell.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}