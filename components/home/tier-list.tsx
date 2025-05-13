import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

const tiers = [
  {
    tier: "S",
    color: "bg-gradient-to-r from-yellow-500 to-amber-600",
    champions: [
      { name: "Kai'Sa", img: "https://images.pexels.com/photos/7915264/pexels-photo-7915264.jpeg", role: "ADC" },
      { name: "Lee Sin", img: "https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg", role: "Jungle" },
      { name: "Yasuo", img: "https://images.pexels.com/photos/6498853/pexels-photo-6498853.jpeg", role: "Mid" },
    ]
  },
  {
    tier: "A",
    color: "bg-gradient-to-r from-blue-500 to-blue-600",
    champions: [
      { name: "Thresh", img: "https://images.pexels.com/photos/6498304/pexels-photo-6498304.jpeg", role: "Support" },
      { name: "Malphite", img: "https://images.pexels.com/photos/6498900/pexels-photo-6498900.jpeg", role: "Top" },
    ]
  },
  {
    tier: "B",
    color: "bg-gradient-to-r from-green-500 to-green-600",
    champions: [
      { name: "Syndra", img: "https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg", role: "Mid" },
    ]
  },
]

const TierList = () => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Tier List</h2>
        <Link href="/tier-list" className="text-sm text-blue-400 hover:text-blue-300">
          Full Tier List
        </Link>
      </div>

      <div className="bg-[#121214] border border-[#2a2a30] rounded-xl divide-y divide-[#2a2a30]">
        {tiers.map((tier) => (
          <div key={tier.tier} className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 ${tier.color} rounded-md flex items-center justify-center font-bold text-white`}>
                {tier.tier}
              </div>
              <h3 className="font-medium">Tier {tier.tier}</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {tier.champions.map((champion) => (
                <Link 
                  key={champion.name}
                  href={`/champions/${champion.name.toLowerCase()}`}
                  className="flex items-center gap-2 bg-[#1a1a1c] hover:bg-[#2a2a30] px-2 py-1.5 rounded-md transition-colors"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={champion.img}
                      alt={champion.name}
                      width={24}
                      height={24}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm">{champion.name}</span>
                  <Badge variant="outline" className="text-[0.65rem] py-0 h-4 bg-[#121214] border-[#2a2a30]">
                    {champion.role}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="p-4 text-center">
          <Link
            href="/tier-list"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            View Complete Tier List
          </Link>
        </div>
      </div>
    </section>
  )
}

export default TierList