"use client"

import { useState, useEffect } from 'react'
import React from 'react'
import { TableOfContents } from '@/components/table-of-contents'
import { Shield, Sword, Target, Brain } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { fetchCounterById } from '@/lib/api'

type CounterData = {
  name: string
  image: string
  strongCounters: Array<{
    name: string
    winRate: string
    image: string
  }>
  weakAgainst: Array<{
    name: string
    winRate: string
    image: string
  }>
  weaknesses: string[]
  counterItems: Array<{
    name: string
    image: string
    description: string
  }>
  strategies: Array<{
    title: string
    description: string
    tips: string[]
  }>
}

export default function CounterDetailClient({ slug }: { slug: string }) {
  const [counterData, setCounterData] = useState<CounterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadCounterData = async () => {
      try {
        setLoading(true)
        const data = await fetchCounterById(slug)
        setCounterData(data)
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu counter:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadCounterData()
  }, [slug])

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
            Không thể tải thông tin counter. Vui lòng thử lại sau.
          </p>
          <div className="text-sm text-gray-400 font-mono bg-black/30 p-4 rounded-lg text-left">
            {error.message}
          </div>
        </div>
      </div>
    )
  }

  if (!counterData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Không tìm thấy</h2>
          <p className="text-gray-300">
            Không tìm thấy thông tin counter cho champion này. Có thể champion không tồn tại hoặc chưa có dữ liệu.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9">
          {/* Main content area */}
          <div className="space-y-8">
            {/* Champion Header */}
            <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16">
                  <Image
                    src={counterData.image || "https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg"}
                    alt={counterData.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-1">Cách khắc chế {counterData.name}</h1>
                  <p className="text-gray-400">Tìm hiểu cách khắc chế và chiến thuật đối phó với {counterData.name}</p>
                </div>
              </div>
            </div>

            {/* Strong Counters Section */}
            {counterData.strongCounters && counterData.strongCounters.length > 0 && (
              <div id="strong-counters" className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Sword className="h-5 w-5 text-green-500" />
                  <h2 className="text-xl font-bold">Khắc chế mạnh</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {counterData.strongCounters.map((champion) => (
                    <Link
                      key={champion.name}
                      href={`/champions/${champion.name.toLowerCase()}`}
                      className="flex items-center gap-4 bg-[#1a1a1c] p-4 rounded-lg hover:bg-[#2a2a30] transition-colors"
                    >
                      <div className="relative w-12 h-12">
                        <Image
                          src={champion.image}
                          alt={champion.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium">{champion.name}</div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 bg-green-500 rounded-full" style={{ width: '60%' }} />
                          <span className="text-sm text-green-500">{champion.winRate}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Weak Against Section */}
            {counterData.weakAgainst && counterData.weakAgainst.length > 0 && (
              <div id="weak-against" className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="h-5 w-5 text-red-500" />
                  <h2 className="text-xl font-bold">Dễ bị khắc chế bởi</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {counterData.weakAgainst.map((champion) => (
                    <Link
                      key={champion.name}
                      href={`/champions/${champion.name.toLowerCase()}`}
                      className="flex items-center gap-4 bg-[#1a1a1c] p-4 rounded-lg hover:bg-[#2a2a30] transition-colors"
                    >
                      <div className="relative w-12 h-12">
                        <Image
                          src={champion.image}
                          alt={champion.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium">{champion.name}</div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 bg-red-500 rounded-full" style={{ width: '40%' }} />
                          <span className="text-sm text-red-500">{champion.winRate}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Weaknesses Section */}
            {counterData.weaknesses && counterData.weaknesses.length > 0 && (
              <div id="weaknesses" className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="h-5 w-5 text-yellow-500" />
                  <h2 className="text-xl font-bold">Điểm yếu chính</h2>
                </div>
                <div className="space-y-4">
                  {counterData.weaknesses.map((weakness, index) => (
                    <div
                      key={index}
                      className="bg-[#1a1a1c] p-4 rounded-lg flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-yellow-500 font-medium">{index + 1}</span>
                      </div>
                      <p className="text-gray-300">{weakness}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Counter Items Section */}
            {counterData.counterItems && counterData.counterItems.length > 0 && (
              <div id="counter-items" className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">Các món đồ khắc chế</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {counterData.counterItems.map((item) => (
                    <div key={item.name} className="bg-[#1a1a1c] rounded-lg overflow-hidden">
                      <div className="relative h-40">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-2">{item.name}</h3>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Counter Strategies Section */}
            {counterData.strategies && counterData.strategies.length > 0 && (
              <div id="strategies" className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="h-5 w-5 text-blue-500" />
                  <h2 className="text-xl font-bold">Chiến thuật khắc chế</h2>
                </div>
                <div className="space-y-6">
                  {counterData.strategies.map((strategy, index) => (
                    <div key={index} className="bg-[#1a1a1c] rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-3">{strategy.title}</h3>
                      <p className="text-gray-400 mb-4">{strategy.description}</p>
                      <div className="space-y-2">
                        {strategy.tips.map((tip, tipIndex) => (
                          <div key={tipIndex} className="flex items-center gap-2 text-gray-300">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        <div className="lg:col-span-3">
          <TableOfContents>
            <li>
              <a href="#strong-counters" className="text-gray-400 hover:text-white transition-colors">
                Khắc chế mạnh
              </a>
            </li>
            <li>
              <a href="#weak-against" className="text-gray-400 hover:text-white transition-colors">
                Dễ bị khắc chế bởi
              </a>
            </li>
            <li>
              <a href="#weaknesses" className="text-gray-400 hover:text-white transition-colors">
                Điểm yếu chính
              </a>
            </li>
            <li>
              <a href="#counter-items" className="text-gray-400 hover:text-white transition-colors">
                Các món đồ khắc chế
              </a>
            </li>
            <li>
              <a href="#strategies" className="text-gray-400 hover:text-white transition-colors">
                Chiến thuật khắc chế
              </a>
            </li>
            <li>
              <a href="#match-history" className="text-gray-400 hover:text-white transition-colors">
                Lịch sử đấu
              </a>
            </li>
          </TableOfContents>
        </div>
      </div>
    </div>
  )
} 