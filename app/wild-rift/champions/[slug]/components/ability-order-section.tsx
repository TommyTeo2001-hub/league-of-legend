import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Trophy } from 'lucide-react'

type AbilityOrderData = {
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
}

type AbilityOrderSectionProps = {
  abilityOrders: AbilityOrderData[]
}

export default function AbilityOrderSection({ abilityOrders }: AbilityOrderSectionProps) {
  return (
    <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">Ability Order</h2>

      <div className="space-y-8">
        {abilityOrders.map((build, index) => (
          <div key={index} className="bg-[#1a1a1c] rounded-xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <h3 className="font-bold">
                  {index === 0 ? 'Most Popular' : `Build ${index + 1}`}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-[#121214] border-[#2a2a30]">
                  Win Rate: {build.winRate}
                </Badge>
                <Badge variant="outline" className="bg-[#121214] border-[#2a2a30]">
                  Pick Rate: {build.pickRate}
                </Badge>
              </div>
            </div>

            {/* Abilities Grid */}
            <div className="space-y-4">
              {/* Passive */}
              <div className="flex items-center gap-4 py-2 border-b border-[#2a2a30]">
                <div className="relative w-12 h-12">
                  <Image
                    src={build.order.passive.icon}
                    alt={build.order.passive.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-grow">
                  <div className="text-sm font-medium">{build.order.passive.name}</div>
                  <div className="text-sm text-gray-400">Passive Ability</div>
                </div>
              </div>

              {/* Q W E R Abilities */}
              {build.order.abilities.map((ability) => (
                <div key={ability.key} className="flex items-center gap-4">
                  <div className="relative w-12 h-12">
                    <Image
                      src={ability.icon}
                      alt={ability.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">{ability.name}</div>
                      <div className="text-sm text-gray-400">{ability.key}</div>
                    </div>
                    <div className="grid grid-cols-18 gap-1">
                      {ability.levels.map((isLeveled, i) => (
                        <div
                          key={i}
                          className={`h-2 rounded-sm ${
                            isLeveled
                              ? 'bg-blue-500'
                              : 'bg-[#2a2a30]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}