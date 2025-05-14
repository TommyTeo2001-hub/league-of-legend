"use client"

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type SearchProps = {
  onSearch: (gameName: string, tagLine: string, region: string) => void;
  isLoading: boolean;
}

export default function SearchSection({ onSearch, isLoading }: SearchProps) {
  const [focused, setFocused] = useState<'ingame' | 'tag' | null>(null)
  const [gameName, setGameName] = useState('')
  const [tagLine, setTagLine] = useState('')
  const [region, setRegion] = useState('europe')

  const handleSearch = () => {
    if (gameName.trim() && tagLine.trim()) {
      onSearch(gameName, tagLine, region)
    }
  }

  return (
    <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-5">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Tìm kiếm người chơi</h2>
        <p className="text-sm text-gray-400">
          Nhập tên và tag của người chơi để xem lịch sử đấu và thống kê.
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
            Tên người chơi
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Nhập tên người chơi..."
              className="bg-[#1a1a1c] border-[#2a2a30] focus-visible:ring-blue-500 pl-10"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
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
            Tag
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Nhập tag..."
              className="bg-[#1a1a1c] border-[#2a2a30] focus-visible:ring-blue-500 pl-10"
              value={tagLine}
              onChange={(e) => setTagLine(e.target.value)}
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

        {/* Region Select */}
        <div>
          <label className="text-sm text-gray-400 mb-1.5 block">
            Khu vực
          </label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="bg-[#1a1a1c] border-[#2a2a30] focus:ring-blue-500">
              <SelectValue placeholder="Chọn khu vực" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1c] border-[#2a2a30]">
              <SelectItem value="europe">EU (Europe)</SelectItem>
              <SelectItem value="americas">NA (Americas)</SelectItem>
              <SelectItem value="asia">KR (Asia)</SelectItem>
              <SelectItem value="sea">OCE (Sea)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
          size="lg"
          onClick={handleSearch}
          disabled={isLoading || !gameName.trim() || !tagLine.trim()}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mr-2"></div>
              Đang tìm kiếm...
            </div>
          ) : (
            <>
          <Search className="w-4 h-4 mr-2" />
              Tìm kiếm
            </>
          )}
        </Button>
      </div>
    </div>
  )
}