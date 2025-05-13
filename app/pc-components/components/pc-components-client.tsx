"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { fetchPCComponents, PCComponent, PCComponentsResponse } from '@/lib/api'

export default function PCComponentsClient() {
  const [componentsData, setComponentsData] = useState<PCComponentsResponse | null>(null)
  const [featuredComponent, setFeaturedComponent] = useState<PCComponent | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const loadComponents = async () => {
      try {
        setLoading(true)
        const data = await fetchPCComponents(currentPage, 10)
        setComponentsData(data)
        
        // Lấy bài viết nổi bật (bài đầu tiên)
        if (data.data.length > 0) {
          setFeaturedComponent(data.data[0])
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu PC components:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadComponents()
  }, [currentPage])

  // Lọc components theo searchQuery
  const filteredComponents = componentsData?.data.filter(component => 
    component.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hiển thị loading
  if (loading && !componentsData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Đang tải...</h2>
            <p className="text-gray-400">Vui lòng đợi trong giây lát</p>
          </div>
        </div>
      </div>
    )
  }

  // Hiển thị lỗi
  if (error && !componentsData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500/20 border border-red-500 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Đã xảy ra lỗi</h2>
          <p className="text-gray-300 mb-2">Không thể tải thông tin PC components. Vui lòng thử lại sau.</p>
          <div className="text-sm text-gray-400 font-mono bg-black/30 p-4 rounded-lg">
            {error.message}
          </div>
        </div>
      </div>
    )
  }

  // Hiển thị khi không có dữ liệu
  if (!componentsData?.data.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Không có thông tin PC Components</h2>
            <p className="text-gray-400">Hiện chưa có thông tin nào về PC components</p>
          </div>
        </div>
      </div>
    )
  }

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Xử lý tác giả (có thể là object hoặc string)
  const getAuthor = (component: PCComponent) => {
    if (typeof component.author === 'string') {
      return component.author;
    }
    return component.author.name;
  };

  // Mảng components còn lại (bỏ qua featured component)
  const remainingComponents = filteredComponents?.slice(featuredComponent ? 1 : 0) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Linh kiện máy tính</h1>
        <p className="text-gray-400">Cập nhật tin tức mới nhất về linh kiện máy tính và đánh giá</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-xl">
          <Input
            type="text"
            placeholder="Tìm kiếm linh kiện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1a1a1c] border-[#2a2a30] focus-visible:ring-blue-500"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Featured Component */}
      {featuredComponent && !searchQuery && (
        <div className="mb-12">
          <Link 
            href={`/pc-components/${featuredComponent.id}`}
            className="block bg-[#121214] border border-[#2a2a30] rounded-xl overflow-hidden hover:border-blue-500 transition-colors"
          >
            <div className="relative h-[400px]">
              <Image
                src={featuredComponent.image}
                alt={featuredComponent.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121214] to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <Badge className="bg-blue-600 mb-4">{featuredComponent.category}</Badge>
                <h2 className="text-3xl font-bold mb-4">{featuredComponent.title}</h2>
                <p className="text-gray-300 mb-4 max-w-2xl">{featuredComponent.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{getAuthor(featuredComponent)}</span>
                  <span>•</span>
                  <span>{formatDate(featuredComponent.date)}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Không có kết quả tìm kiếm */}
      {filteredComponents?.length === 0 && searchQuery && (
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center mb-8">
          <h2 className="text-xl font-bold mb-4">Không tìm thấy linh kiện nào</h2>
          <p className="text-gray-400">Không có linh kiện nào phù hợp với từ khóa tìm kiếm "{searchQuery}"</p>
        </div>
      )}

      {/* Components Grid */}
      {remainingComponents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {remainingComponents.map((component) => (
            <Link
              key={component.id}
              href={`/pc-components/${component.id}`}
              className="bg-[#121214] border border-[#2a2a30] rounded-xl overflow-hidden hover:border-blue-500 transition-colors"
            >
              <div className="relative h-48">
                <Image
                  src={component.image}
                  alt={component.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <Badge className="mb-3" variant="outline">{component.category}</Badge>
                <h3 className="text-xl font-bold mb-2">{component.title}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{component.excerpt}</p>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span>{getAuthor(component)}</span>
                  <span>•</span>
                  <span>{formatDate(component.date)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {componentsData && componentsData.totalPages > 1 && (
        <div className="flex justify-center my-8">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="bg-[#1a1a1c] border-[#2a2a30]"
            >
              Trước
            </Button>
            
            {[...Array(componentsData.totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                className={currentPage === i + 1 ? "bg-blue-600" : "bg-[#1a1a1c] border-[#2a2a30]"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(componentsData.totalPages, p + 1))}
              disabled={currentPage === componentsData.totalPages}
              className="bg-[#1a1a1c] border-[#2a2a30]"
            >
              Tiếp
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 