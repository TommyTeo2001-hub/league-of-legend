import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

const ChampionSpotlight = () => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Champion Spotlight</h2>
        <Link href="/champions" className="text-sm text-blue-400 hover:text-blue-300">
          View All Champions
        </Link>
      </div>

      <div className="bg-[#121214] border border-[#2a2a30] rounded-xl overflow-hidden">
        <div className="relative h-[180px] overflow-hidden">
          <Image
            src="https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg"
            alt="Lux Champion"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121214] to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-4">
            <h3 className="text-2xl font-bold">Lux</h3>
            <p className="text-sm text-gray-300">The Lady of Luminosity</p>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-[#1a1a1c] border-[#2a2a30] text-blue-400">
              Mage
            </Badge>
            <Badge variant="outline" className="bg-[#1a1a1c] border-[#2a2a30] text-purple-400">
              Support
            </Badge>
            <Badge variant="outline" className="bg-[#1a1a1c] border-[#2a2a30]">
              Mid
            </Badge>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Damage</span>
              <div className="w-32 h-2 bg-[#1a1a1c] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }} />
              </div>
              <span className="text-sm">8.5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Toughness</span>
              <div className="w-32 h-2 bg-[#1a1a1c] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }} />
              </div>
              <span className="text-sm">4.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Utility</span>
              <div className="w-32 h-2 bg-[#1a1a1c] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
              </div>
              <span className="text-sm">7.5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Mobility</span>
              <div className="w-32 h-2 bg-[#1a1a1c] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '30%' }} />
              </div>
              <span className="text-sm">3.0</span>
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <Link 
              href="/champions/lux"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors flex-1 text-center"
            >
              Champion Details
            </Link>
            <Link 
              href="/guides/champion/lux"
              className="bg-[#1a1a1c] hover:bg-[#2a2a30] text-gray-200 text-sm font-medium py-2 px-4 rounded-md border border-[#2a2a30] transition-colors flex-1 text-center"
            >
              Lux Guides
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChampionSpotlight