import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

type ItemData = {
  name: string
  icon: string
  price?: number
  description?: string
  stats?: {
    [key: string]: string
  }
  passive?: string
  active?: string
  mythicPassive?: string
}

type BuildSectionProps = {
  starters: ItemData[]
  coreItems: ItemData[]
  luxuryItems: ItemData[]
  boots: ItemData[]
}

const ItemTooltip = ({ item }: { item: ItemData }) => {
  return (
    <div className="item-tooltip">
      <div className="flex items-center gap-3 mb-2">
        <div className="relative w-12 h-12">
          <Image
            src={item.icon}
            alt={item.name}
            fill
            className="object-cover rounded"
          />
        </div>
        <div>
          <h4 className="font-medium text-white">{item.name}</h4>
          {item.price && (
            <div className="text-yellow-400 text-sm">{item.price} Gold</div>
          )}
        </div>
      </div>
      
      {item.stats && Object.entries(item.stats).length > 0 && (
        <div className="mb-2 text-gray-300">
          {Object.entries(item.stats).map(([stat, value]) => (
            <div key={stat} className="text-sm">
              {stat}: {value}
            </div>
          ))}
        </div>
      )}
      
      {item.description && (
        <div className="text-sm text-gray-400 mb-2">{item.description}</div>
      )}
      
      {item.passive && (
        <div className="mb-2">
          <div className="text-blue-400 text-sm font-medium">Passive:</div>
          <div className="text-sm text-gray-300">{item.passive}</div>
        </div>
      )}
      
      {item.active && (
        <div className="mb-2">
          <div className="text-blue-400 text-sm font-medium">Active:</div>
          <div className="text-sm text-gray-300">{item.active}</div>
        </div>
      )}
      
      {item.mythicPassive && (
        <div>
          <div className="text-purple-400 text-sm font-medium">Mythic Passive:</div>
          <div className="text-sm text-gray-300">{item.mythicPassive}</div>
        </div>
      )}
    </div>
  )
}

export default function BuildSection({ starters, coreItems, luxuryItems, boots }: BuildSectionProps) {
  return (
    <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg"
          alt="Build Background"
          fill
          className="object-cover opacity-5"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#121214]/80 to-[#121214]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recommended Build</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#1a1a1c] border-[#2a2a30]">
              Win Rate: 63%
            </Badge>
            <Badge variant="outline" className="bg-[#1a1a1c] border-[#2a2a30]">
              Pick Rate: 16%
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <p className="text-yellow-400 font-medium mb-4">Core Build Path</p>
              <div className="bg-[#1a1a1c]/60 backdrop-blur-sm rounded-lg p-4">
                <div className="flex flex-wrap gap-1">
                  {coreItems.map((item) => (
                    <div key={item.name} className="animated-button1 relative group">
                      <div className="relative w-10 h-10">
                        <Image
                          src={item.icon}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <ItemTooltip item={item} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-yellow-400 font-medium mb-4">Starting Items</p>
              <div className="bg-[#1a1a1c]/60 backdrop-blur-sm rounded-lg p-4">
                <div className="flex flex-wrap gap-1">
                  {starters.map((item) => (
                    <div key={item.name} className="animated-button1 relative group">
                      <div className="relative w-10 h-10">
                        <Image
                          src={item.icon}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <ItemTooltip item={item} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div>
              <p className="text-yellow-400 font-medium mb-4">Situational Items</p>
              <div className="bg-[#1a1a1c]/60 backdrop-blur-sm rounded-lg p-4">
                <div className="flex flex-wrap gap-1">
                  {luxuryItems.map((item) => (
                    <div key={item.name} className="animated-button1 relative group">
                      <div className="relative w-10 h-10">
                        <Image
                          src={item.icon}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <ItemTooltip item={item} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-yellow-400 font-medium mb-4">Boots Options</p>
              <div className="bg-[#1a1a1c]/60 backdrop-blur-sm rounded-lg p-4">
                <div className="flex flex-wrap gap-1">
                  {boots.map((item) => (
                    <div key={item.name} className="animated-button1 relative group">
                      <div className="relative w-10 h-10">
                        <Image
                          src={item.icon}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <ItemTooltip item={item} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}