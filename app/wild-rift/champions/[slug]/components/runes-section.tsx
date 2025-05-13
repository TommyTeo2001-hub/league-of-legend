import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

type RuneData = {
  name: string
  icon: string
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
    <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg"
          alt="Runes Background"
          fill
          className="object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#121214]/80 to-[#121214]" />
      </div>

      <div className="relative z-10">
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

        <div className="rune">
          <div className="rune1">
            <p className="text-yellow-400 font-medium mb-4">Primary Runes with Win 66.23% and Pick 62.31%</p>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8">
                {primaryRunes.map((rune) => (
                  <div 
                    key={rune.name}
                    className="animated-button1 relative inline-block m-2"
                  >
                    <div className="relative w-10 h-10">
                      <Image
                        src={rune.icon}
                        alt={rune.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <span className="absolute inset-0 bg-blue-500/10"></span>
                    <span className="absolute inset-0 bg-blue-500/10 animate-pulse delay-75"></span>
                    <span className="absolute inset-0 bg-blue-500/10 animate-pulse delay-150"></span>
                    <span className="absolute inset-0 bg-blue-500/10 animate-pulse delay-300"></span>
                  </div>
                ))}
              </div>
              <div className="md:col-span-4">
                <button className="animated-button1 strong_tuong w-full bg-blue-600 text-white py-2 px-4 rounded-lg relative overflow-hidden">
                  <span className="absolute inset-0 bg-white/20"></span>
                  <span className="absolute inset-0 bg-white/20 animate-pulse delay-75"></span>
                  <span className="absolute inset-0 bg-white/20 animate-pulse delay-150"></span>
                  <span className="absolute inset-0 bg-white/20 animate-pulse delay-300"></span>
                  <span className="relative z-10">Advanced Tips</span>
                </button>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-yellow-400 font-medium mb-4">Secondary Runes with Win 53.92% and Pick 24.45%</p>
              <div className="flex flex-wrap gap-2">
                {secondaryRunes.map((rune) => (
                  <div 
                    key={rune.name}
                    className="animated-button1 relative inline-block"
                  >
                    <div className="relative w-10 h-10">
                      <Image
                        src={rune.icon}
                        alt={rune.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <span className="absolute inset-0 bg-purple-500/10"></span>
                    <span className="absolute inset-0 bg-purple-500/10 animate-pulse delay-75"></span>
                    <span className="absolute inset-0 bg-purple-500/10 animate-pulse delay-150"></span>
                    <span className="absolute inset-0 bg-purple-500/10 animate-pulse delay-300"></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summoner Spells */}
        <div className="mt-8">
          <div className="text-sm text-gray-400 mb-3">SUMMONER SPELLS</div>
          <div className="grid grid-cols-2 gap-4 max-w-[200px]">
            {summonerSpells.map((spell) => (
              <div 
                key={spell.name} 
                className="animated-button1 relative bg-[#1a1a1c]/80 backdrop-blur-sm rounded-lg p-3"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                  <Image
                    src={spell.icon}
                    alt={spell.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-sm font-medium text-center">{spell.name}</div>
                <span className="absolute inset-0 bg-blue-500/5"></span>
                <span className="absolute inset-0 bg-blue-500/5 animate-pulse delay-75"></span>
                <span className="absolute inset-0 bg-blue-500/5 animate-pulse delay-150"></span>
                <span className="absolute inset-0 bg-blue-500/5 animate-pulse delay-300"></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}