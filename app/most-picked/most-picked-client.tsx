"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Scatter, ScatterChart, ZAxis } from 'recharts'
import { Search, Sword, Shield, Wand2, Crosshair, Heart } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { fetchMostPicked } from '@/lib/api'

// Champions type
type Trend = {
  week: string;
  pickRate: number;
  winRate: number;
  matches: number;
}

type Champion = {
  name: string;
  image: string;
  pickRate: string;
  winRate: string;
  role: string;
  tier: string;
  totalMatches: string;
  change: string;
  trend: Trend[];
}

const roles = [
  { id: 'all', name: 'All Roles', icon: Sword },
  { id: 'top', name: 'Top', icon: Shield },
  { id: 'jungle', name: 'Jungle', icon: Sword },
  { id: 'mid', name: 'Mid', icon: Wand2 },
  { id: 'adc', name: 'ADC', icon: Crosshair },
  { id: 'support', name: 'Support', icon: Heart },
]

export default function MostPickedClient() {
  const [champions, setChampions] = useState<Champion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null)
  const [selectedRole, setSelectedRole] = useState('all')

  useEffect(() => {
    const loadMostPicked = async () => {
      try {
        setLoading(true)
        const data = await fetchMostPicked()
        setChampions(data)
        if (data.length > 0) {
          setSelectedChampion(data[0])
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu most picked:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadMostPicked()
  }, [])

  // Tính toán scatter data từ champions
  const scatterData = champions.map(champion => ({
    name: champion.name,
    pickRate: parseFloat(champion.pickRate),
    winRate: parseFloat(champion.winRate),
    matches: parseInt(champion.totalMatches.replace(/,/g, '')),
    role: champion.role,
    tier: champion.tier
  }))

  const filteredChampions = champions.filter(champion =>
    champion.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedRole === 'all' || champion.role.toLowerCase() === selectedRole.toLowerCase())
  )

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a1c] border border-[#2a2a30] rounded-lg p-3">
          <p className="text-sm font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const ScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-[#1a1a1c] border border-[#2a2a30] rounded-lg p-3">
          <p className="text-sm font-medium mb-1">{data.name}</p>
          <p className="text-sm text-blue-400">Pick Rate: {data.pickRate}%</p>
          <p className="text-sm text-green-400">Win Rate: {data.winRate}%</p>
          <p className="text-sm text-gray-400">Matches: {data.matches.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">{data.role}</Badge>
            <Badge className={`text-xs ${data.tier === 'S' ? 'bg-yellow-600' : 'bg-blue-600'}`}>
              Tier {data.tier}
            </Badge>
          </div>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Đang tải...</h2>
          <p className="text-gray-300">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-800/20 border border-red-500 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Lỗi khi tải dữ liệu</h2>
          <p className="text-gray-300 mb-4">
            Không thể tải thông tin tướng được pick nhiều. Vui lòng thử lại sau.
          </p>
          <div className="text-sm text-gray-400 font-mono bg-black/30 p-4 rounded-lg text-left">
            {error.message}
          </div>
        </div>
      </div>
    )
  }

  if (champions.length === 0 || !selectedChampion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Không có dữ liệu</h2>
          <p className="text-gray-300">
            Hiện không có thông tin về tướng được pick nhiều.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Most Picked Champions</h1>
        <p className="text-gray-400">Track the most popular champions and their performance metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Champions List */}
        <div>
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
            {/* Search and Filters */}
            <div className="space-y-4 mb-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search champions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#1a1a1c] border-[#2a2a30] focus-visible:ring-blue-500"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              {/* Role Filters */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {roles.map((role) => {
                  const Icon = role.icon
                  return (
                    <Button
                      key={role.id}
                      variant={selectedRole === role.id ? "default" : "outline"}
                      className={`flex items-center gap-2 ${
                        selectedRole === role.id
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-[#1a1a1c] hover:bg-[#2a2a30] border-[#2a2a30]"
                      }`}
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{role.name}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Champions List */}
            <div className="space-y-4">
              {filteredChampions.map((champion) => (
                <button
                  key={champion.name}
                  onClick={() => setSelectedChampion(champion)}
                  className={`w-full text-left bg-[#1a1a1c] rounded-lg p-4 hover:bg-[#2a2a30] transition-colors ${
                    selectedChampion.name === champion.name ? 'border-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16">
                      <Image
                        src={champion.image}
                        alt={champion.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{champion.name}</h3>
                        <Badge className={`${
                          champion.tier === 'S' ? 'bg-yellow-600' : 'bg-blue-600'
                        }`}>
                          Tier {champion.tier}
                        </Badge>
                        <Badge variant="outline" className="bg-[#121214] border-[#2a2a30]">
                          {champion.role}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Pick Rate</div>
                          <div className="font-medium flex items-center gap-1">
                            {champion.pickRate}
                            <span className={`text-xs ${
                              champion.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {champion.change}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">Win Rate</div>
                          <div className="font-medium">{champion.winRate}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-gray-400">Total Matches</div>
                      <div className="font-medium">{champion.totalMatches}</div>
                    </div>
                  </div>
                </button>
              ))}

              {filteredChampions.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No champions found matching your criteria
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-8">
          {/* Trend Chart */}
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Champion Performance Trend</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedChampion.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a30" />
                  <XAxis dataKey="week" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pickRate"
                    stroke="#3b82f6"
                    name="Pick Rate"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="winRate"
                    stroke="#10b981"
                    name="Win Rate"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scatter Plot */}
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Pick Rate vs Win Rate Distribution</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a30" />
                  <XAxis
                    type="number"
                    dataKey="pickRate"
                    name="Pick Rate"
                    stroke="#9ca3af"
                    label={{ value: 'Pick Rate (%)', position: 'bottom', fill: '#9ca3af' }}
                  />
                  <YAxis
                    type="number"
                    dataKey="winRate"
                    name="Win Rate"
                    stroke="#9ca3af"
                    label={{ value: 'Win Rate (%)', angle: -90, position: 'left', fill: '#9ca3af' }}
                  />
                  <ZAxis
                    type="number"
                    dataKey="matches"
                    range={[50, 400]}
                    name="Total Matches"
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ScatterTooltip />} />
                  <Scatter
                    data={scatterData.filter(champion => 
                      selectedRole === 'all' || 
                      champion.role.toLowerCase() === selectedRole.toLowerCase()
                    )}
                    fill="#3b82f6"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 