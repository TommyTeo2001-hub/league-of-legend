"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { fetchItems } from '@/lib/api'

type ItemData = {
  id: string
  name: string
  image: string
  price: number
  stats: string | { [key: string]: any }
  category: string
  description: string
}

const categories = [
  { id: 'all', name: 'Tất cả' },
  { id: 'attack', name: 'Tấn công' },
  { id: 'magic', name: 'Phép thuật' },
  { id: 'defense', name: 'Phòng thủ' },
  { id: 'boots', name: 'Giày' },
]

export default function ItemsClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [items, setItems] = useState<ItemData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true)
        const data = await fetchItems()
        
        setItems(data)
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu items:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadItems()
  }, [])

  const filteredItems = items.filter(item => {
    const itemName = item.name ? item.name.toLowerCase() : '';
    const itemDesc = item.description ? item.description.toLowerCase() : '';
    const searchTerm = searchQuery.toLowerCase();
    
    const matchesSearch = 
      itemName.includes(searchTerm) || 
      itemDesc.includes(searchTerm);
    
    const itemCategory = item.category ? item.category.toLowerCase() : '';
    const matchesCategory = 
      selectedCategory === 'all' || 
      itemCategory === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

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
            Không thể tải thông tin items. Vui lòng thử lại sau.
          </p>
          <div className="text-sm text-gray-400 font-mono bg-black/30 p-4 rounded-lg text-left">
            {error.message}
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Không có dữ liệu</h2>
          <p className="text-gray-300">
            Hiện không có thông tin về item nào.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Items</h1>
        <p className="text-gray-400">Tìm kiếm tất cả items trong League of Legends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-5 sticky top-20">
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-1.5 block">Tìm kiếm items</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Tìm theo tên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#1a1a1c] border-[#2a2a30] focus-visible:ring-blue-500"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-400 mb-2">Danh mục</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-[#2a2a30]'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="lg:col-span-3">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/items/${item.id}`}
                  className="bg-[#121214] border border-[#2a2a30] rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
                >
                  <div className="p-4">
                    <div className="relative w-16 h-16 mx-auto mb-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="text-center font-medium mb-2">{item.name}</h3>
                    <div className="flex justify-center gap-2 mb-3">
                      <Badge variant="outline" className="bg-[#1a1a1c] border-[#2a2a30]">
                        {item.category || "Unknown"}
                      </Badge>
                      <Badge variant="outline" className="bg-[#1a1a1c] border-[#2a2a30]">
                        {item.price} Gold
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 text-center mb-3">
                      {typeof item.stats === 'string' ? item.stats : 
                        typeof item.stats === 'object' ? 
                          Object.entries(item.stats)
                            .map(([key, val]) => `${key}: ${val}`)
                            .join(', ') 
                          : ''}
                    </p>
                    <p className="text-sm text-gray-400 line-clamp-2 text-center">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center">
              <h3 className="text-xl font-medium mb-2">Không tìm thấy item nào</h3>
              <p className="text-gray-400">Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 