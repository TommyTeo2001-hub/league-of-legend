"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Sword, Shield, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { fetchItemById } from '@/lib/api'

type ItemDetailData = {
  id: string
  name: string
  image: string
  price: number
  totalPrice: number
  sellPrice: number
  stats: string | {
    [key: string]: string | number | boolean | null | undefined | any
  }
  category: string
  description: string
  buildPath: Array<{
    name: string
    image: string
    price: number
  }>
  buildsInto: Array<{
    name: string
    image: string
    price: number
  }>
  recommendedChampions: Array<{
    name: string
    image: string
  }>
  usage: string[]
  tips: string[]
}

export default function ItemDetailClient({ slug }: { slug: string }) {
  const [itemData, setItemData] = useState<ItemDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadItemData = async () => {
      try {
        setLoading(true)
        const data = await fetchItemById(slug)
        setItemData(data)
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu item:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadItemData()
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
            Không thể tải thông tin chi tiết cho item này. Vui lòng thử lại sau.
          </p>
          <div className="text-sm text-gray-400 font-mono bg-black/30 p-4 rounded-lg text-left">
            {error.message}
          </div>
        </div>
      </div>
    )
  }

  if (!itemData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Không tìm thấy</h2>
          <p className="text-gray-300">
            Không tìm thấy thông tin về item này. Có thể item không tồn tại hoặc đã bị xóa.
          </p>
          <Link 
            href="/items"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mt-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại trang Items
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link 
        href="/items"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại Items
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8">
            <div className="flex items-start gap-6">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={itemData.image}
                  alt={itemData.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{itemData.name}</h1>
                  <Badge className="bg-blue-600">{itemData.category}</Badge>
                </div>
                <div className="space-y-1 mb-4">
                  {itemData.stats && typeof itemData.stats === 'object' ? (
                    Object.entries(itemData.stats).map(([key, value], index) => (
                      <div key={index} className="text-gray-300">
                        {typeof value === 'string' ? value : 
                          typeof value === 'object' ? JSON.stringify(value) : 
                          String(value)}
                      </div>
                    ))
                  ) : itemData.stats && typeof itemData.stats === 'string' ? (
                    <div className="text-gray-300">{itemData.stats}</div>
                  ) : null}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">Mua:</span>
                    <span className="text-yellow-400">{itemData.price} Gold</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">Bán:</span>
                    <span className="text-yellow-400">{itemData.sellPrice} Gold</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Usage */}
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Mô tả</h2>
            <p className="text-gray-300 mb-6">{itemData.description}</p>

            {itemData.usage && itemData.usage.length > 0 && (
              <>
                <h3 className="font-bold mb-3">Cách sử dụng</h3>
                <ul className="space-y-2 mb-6">
                  {itemData.usage.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <Sword className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {itemData.tips && itemData.tips.length > 0 && (
              <>
                <h3 className="font-bold mb-3">Mẹo chuyên gia</h3>
                <ul className="space-y-2">
                  {itemData.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <Zap className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Build Path */}
          {itemData.buildPath && itemData.buildPath.length > 0 && (
            <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Công thức</h2>
              <div className="space-y-4">
                {itemData.buildPath.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-[#1a1a1c] p-3 rounded-lg">
                    <div className="relative w-12 h-12">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-yellow-400">{item.price} Gold</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Builds Into */}
          {itemData.buildsInto && itemData.buildsInto.length > 0 && (
            <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Chế tạo thành</h2>
              <div className="space-y-4">
                {itemData.buildsInto.map((item, index) => (
                  <Link
                    key={index}
                    href={`/items/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center gap-4 bg-[#1a1a1c] p-3 rounded-lg hover:bg-[#2a2a30] transition-colors"
                  >
                    <div className="relative w-12 h-12">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-yellow-400">{item.price} Gold</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Champions */}
          {itemData.recommendedChampions && itemData.recommendedChampions.length > 0 && (
            <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Tướng phù hợp</h2>
              <div className="space-y-4">
                {itemData.recommendedChampions.map((champion, index) => (
                  <Link
                    key={index}
                    href={`/champions/${champion.name.toLowerCase()}`}
                    className="flex items-center gap-4 bg-[#1a1a1c] p-3 rounded-lg hover:bg-[#2a2a30] transition-colors"
                  >
                    <div className="relative w-12 h-12">
                      <Image
                        src={champion.image}
                        alt={champion.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <div className="font-medium">{champion.name}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 