"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, Sword, Shield, Target, Coins } from 'lucide-react'
import TeamTable from './team-table'

type MatchItem = {
  id: number
  image: string
}

type TeamMember = {
  name: string
  champion: string
  image: string
}

type MatchData = {
  id: number
  champion: {
    name: string
    image: string
  }
  result: string
  kda: string
  kdaRatio: number
  role: string
  gameType: string
  duration: string
  timestamp: string
  items: MatchItem[]
  team: TeamMember[]
}

type MatchDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  matchData: MatchData | null
}

export default function MatchDetailsModal({ isOpen, onClose, matchData }: MatchDetailsModalProps) {
  if (!matchData) return null

  // Parse KDA để hiển thị chi tiết
  const kdaParts = matchData.kda.split('/').map(Number);
  const kills = kdaParts[0] || 0;
  const deaths = kdaParts[1] || 0;
  const assists = kdaParts[2] || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl bg-[#121214] border-[#2a2a30] p-0 animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogTitle className="sr-only">Chi tiết trận đấu</DialogTitle>
        
        {/* Match Header */}
        <div className="p-6 border-b border-[#2a2a30] bg-[#1a1a1c]">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Blue Team */}
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 ${matchData.result === 'Victory' ? 'bg-blue-500 animate-pulse' : 'bg-red-500'} rounded-full`} />
                <span className={`${matchData.result === 'Victory' ? 'text-blue-500' : 'text-red-500'} font-medium text-lg`}>
                  {matchData.result === 'Victory' ? 'Chiến thắng' : 'Thất bại'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>{kills} Điểm hạ gục</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{matchData.duration}</span>
                </div>
              </div>
            </div>

            {/* Match Info */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm font-medium">
                <div className="w-10 h-10 relative flex-shrink-0">
                  <Image
                    src={matchData.champion.image}
                    alt={matchData.champion.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <span>{matchData.champion.name}</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-green-500/20 rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-sm" />
                  </div>
                  <span className="text-sm">{kills}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-red-500/20 rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-500 rounded-sm" />
                  </div>
                  <span className="text-sm">{deaths}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-blue-500/20 rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-sm" />
                  </div>
                  <span className="text-sm">{assists}</span>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                <Badge variant="outline" className="bg-[#121214] border-[#2a2a30]">
                  {matchData.gameType}
                </Badge>
              </div>
            </div>

            {/* More Info */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-2">
                <span className="text-gray-300 font-medium text-lg">KDA</span>
                <div className="px-2 py-1 bg-[#121214] border border-[#2a2a30] rounded text-yellow-400">
                  {matchData.kdaRatio.toFixed(2)}
                </div>
              </div>
              <div className="flex items-center justify-end gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Sword className="w-4 h-4" />
                  <span>{matchData.role}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>{matchData.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <div className="px-6 py-4 border-b border-[#2a2a30]">
            <TabsList className="bg-[#1a1a1c] border border-[#2a2a30]">
              <TabsTrigger 
                value="overview"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Tổng quan
              </TabsTrigger>
              <TabsTrigger 
                value="items"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Trang bị
              </TabsTrigger>
              <TabsTrigger 
                value="team"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Đội hình
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thông tin tổng quan */}
              <div className="bg-[#1a1a1c] p-5 rounded-lg space-y-4">
                <h3 className="text-lg font-medium">Thống kê trận đấu</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-400">KDA</div>
                    <div className="font-medium text-lg">{matchData.kda}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-400">Tỷ lệ KDA</div>
                    <div className="font-medium text-lg">{matchData.kdaRatio.toFixed(2)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-400">Thời gian</div>
                    <div className="font-medium">{matchData.duration}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-400">Kết quả</div>
                    <div className={`font-medium ${matchData.result === 'Victory' ? 'text-blue-500' : 'text-red-500'}`}>
                      {matchData.result === 'Victory' ? 'Chiến thắng' : 'Thất bại'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-400">Vai trò</div>
                    <div className="font-medium">{matchData.role}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-400">Loại trận đấu</div>
                    <div className="font-medium">{matchData.gameType}</div>
                  </div>
                </div>
              </div>

              {/* Champion info */}
              <div className="bg-[#1a1a1c] p-5 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Thông tin tướng</h3>
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20">
                    <Image
                      src={matchData.champion.image}
                      alt={matchData.champion.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <div className="text-xl font-medium mb-1">{matchData.champion.name}</div>
                    <div className="text-gray-400 mb-2">{matchData.role}</div>
                    <Link 
                      href={`/champions/${matchData.champion.name.toLowerCase()}`}
                      className="text-blue-400 hover:underline text-sm"
                    >
                      Xem chi tiết tướng
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="items" className="mt-0 p-6">
            <div className="space-y-6">
              {/* Items Grid */}
              <div>
                <h3 className="text-lg font-medium mb-4">Các trang bị đã mua</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {matchData.items && matchData.items.map((item) => (
                    <div key={item.id} className="bg-[#1a1a1c] p-4 rounded-lg flex items-center gap-4">
                      <div className="relative w-14 h-14">
                        <Image
                          src={item.image}
                          alt={`Item ${item.id}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <div className="font-medium">Item {item.id}</div>
                        <Link
                          href={`/items/item-${item.id}`}
                          className="text-sm text-blue-400 hover:underline"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Build Timeline Visualization */}
              <div>
                <h3 className="text-lg font-medium mb-4">Timeline xây dựng trang bị</h3>
                <div className="bg-[#1a1a1c] p-4 rounded-lg">
                  <div className="relative">
                    <div className="absolute h-full w-0.5 bg-blue-500/20 left-0 top-0"></div>
                    <div className="space-y-6 pl-6">
                      {[
                        { time: "0:00", event: "Bắt đầu trận đấu", items: ["Trang bị khởi đầu"] },
                        { time: matchData.duration.split(':')[0] + ":00", event: "Kết thúc trận đấu", items: ["Hoàn thiện các trang bị"] }
                      ].map((point, index) => (
                        <div key={index} className="relative">
                          <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-8 top-1/2 -translate-y-1/2"></div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-blue-400 font-medium">{point.time}</span>
                            <span className="text-gray-400">{point.event}</span>
                          </div>
                          <div className="text-sm text-gray-300">{point.items.join(', ')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="mt-0 p-6">
            <div className="space-y-6">
              {/* Bảng thông tin đội hình */}
              <TeamTable matchData={matchData} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Team Members */}
                <div className="bg-[#1a1a1c] p-5 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Đồng đội</h3>
                  <div className="space-y-3">
                    {matchData.team && matchData.team.map((player) => (
                      <div key={player.name} className="flex items-center gap-3 p-3 bg-[#121214] rounded-lg">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={player.image}
                            alt={player.champion}
                            fill
                            className="object-cover rounded-full"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm text-gray-400">{player.champion}</div>
                        </div>
                        <div className="ml-auto">
                          <Link 
                            href={`/champions/${player.champion.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-xs text-blue-400 hover:underline"
                          >
                            Xem tướng
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Performance */}
                <div className="bg-[#1a1a1c] p-5 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Hiệu suất đội</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#121214] rounded-lg flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Tỷ lệ thắng đội</div>
                        <div className="font-medium text-lg">
                          {matchData.result === 'Victory' ? '100%' : '0%'}
                        </div>
                      </div>
                      <div className={`text-2xl ${matchData.result === 'Victory' ? 'text-blue-500' : 'text-red-500'}`}>
                        {matchData.result === 'Victory' ? 'W' : 'L'}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-[#121214] rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Thời gian trận đấu</div>
                      <div className="text-lg font-medium">{matchData.duration}</div>
                    </div>

                    <div className="p-4 bg-[#121214] rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Thời điểm diễn ra</div>
                      <div className="text-lg font-medium">{matchData.timestamp}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}