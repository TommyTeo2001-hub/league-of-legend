"use client"

import { useState, useEffect } from 'react'
import { fetchChampionById } from '@/lib/api'
import ChampionDetails from './champion-details'

export default function ChampionPageClient({ slug }: { slug: string }) {
  const [championData, setChampionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadChampionData = async () => {
      try {
        setLoading(true)
        const data = await fetchChampionById('wildrift', slug)
        setChampionData(data)
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu champion:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadChampionData()
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
            Không thể tải thông tin cho champion này. Vui lòng thử lại sau.
          </p>
          <div className="text-sm text-gray-400 font-mono bg-black/30 p-4 rounded-lg text-left">
            {error.message}
          </div>
        </div>
      </div>
    )
  }

  if (!championData) return null;

  return <ChampionDetails championData={championData} />
} 