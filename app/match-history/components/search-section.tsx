"use client"

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SearchSection() {
  const [focused, setFocused] = useState<'ingame' | 'tag' | null>(null)

  return (
    <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-5">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Search Player</h2>
        <p className="text-sm text-gray-400">
          Enter a summoner's name and tag to view their match history and stats.
        </p>
      </div>

      <div className="space-y-4">
        {/* Ingame Name Input */}
        <div 
          className={`relative transition-all duration-300 ${
            focused === 'ingame' ? 'scale-105' : ''
          }`}
        >
          <label className="text-sm text-gray-400 mb-1.5 block">
            Summoner Name
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter summoner name..."
              className="bg-[#1a1a1c] border-[#2a2a30] focus-visible:ring-blue-500 pl-10"
              onFocus={() => setFocused('ingame')}
              onBlur={() => setFocused(null)}
            />
            <Search 
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${
                focused === 'ingame' ? 'text-blue-500' : 'text-gray-400'
              }`}
            />
          </div>
        </div>

        {/* Tag Name Input */}
        <div 
          className={`relative transition-all duration-300 ${
            focused === 'tag' ? 'scale-105' : ''
          }`}
        >
          <label className="text-sm text-gray-400 mb-1.5 block">
            Tag Name
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter tag name..."
              className="bg-[#1a1a1c] border-[#2a2a30] focus-visible:ring-blue-500 pl-10"
              onFocus={() => setFocused('tag')}
              onBlur={() => setFocused(null)}
            />
            <span 
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-sm font-medium transition-colors duration-300 ${
                focused === 'tag' ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              #
            </span>
          </div>
        </div>

        {/* Search Button */}
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
          size="lg"
        >
          <Search className="w-4 h-4 mr-2" />
          Search Player
        </Button>
      </div>
    </div>
  )
}