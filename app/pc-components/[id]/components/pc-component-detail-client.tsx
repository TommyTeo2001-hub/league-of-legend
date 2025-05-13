"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Share2, ThumbsUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import CommentsSection from './comments-section'
import { fetchPCComponentById, fetchPCComponents, PCComponent, PCComponentsResponse } from '@/lib/api'

export default function PCComponentDetailClient({ id }: { id: string }) {
  const [component, setComponent] = useState<PCComponent | null>(null)
  const [relatedComponents, setRelatedComponents] = useState<PCComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadComponent = async () => {
      try {
        setLoading(true)
        const data = await fetchPCComponentById(id)
        setComponent(data)
        
        // Lấy các linh kiện liên quan
        const allComponents = await fetchPCComponents(1, 4)
        const related = allComponents.data
          .filter((c: PCComponent) => c.id !== id)
          .slice(0, 3)
        setRelatedComponents(related)
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu linh kiện:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadComponent()
  }, [id])

  if (loading) {
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500/20 border border-red-500 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Đã xảy ra lỗi</h2>
          <p className="text-gray-300 mb-2">Không thể tải thông tin linh kiện. Vui lòng thử lại sau.</p>
          <div className="text-sm text-gray-400 font-mono bg-black/30 p-4 rounded-lg">
            {error.message}
          </div>
        </div>
      </div>
    )
  }

  if (!component) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy linh kiện</h2>
          <p className="text-gray-300 mb-4">
            Linh kiện bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link 
            href="/pc-components"
            className="inline-flex items-center gap-2 text-blue-400 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách linh kiện
          </Link>
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
  const getAuthor = (author: string | { name: string; image?: string }) => {
    if (typeof author === 'string') {
      return { name: author, image: undefined };
    }
    return author;
  };

  const authorInfo = getAuthor(component.author);

  // Fake data cho tương tác
  const engagementData = {
    likes: 245,
    shares: 89
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link 
        href="/pc-components"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách linh kiện
      </Link>

      {/* Component Header */}
      <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
        <Image
          src={component.image}
          alt={component.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <Badge className="bg-blue-600 mb-4">{component.category}</Badge>
          <h1 className="text-4xl font-bold mb-4">{component.title}</h1>
          <p className="text-gray-300 mb-4 max-w-2xl">{component.excerpt}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={authorInfo.image} />
                <AvatarFallback>{authorInfo.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{authorInfo.name}</div>
                <div className="text-sm text-gray-400">
                  {formatDate(component.date)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 mb-8">
            {/* Specifications if available */}
            {component.specifications && Object.keys(component.specifications).length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Thông số kỹ thuật</h2>
                <div className="bg-[#1a1a1c] rounded-lg p-4">
                  <dl className="divide-y divide-[#2a2a30]">
                    {Object.entries(component.specifications).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-3 py-3 gap-2">
                        <dt className="text-gray-400">{key}</dt>
                        <dd className="col-span-2 text-white">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {/* Price if available */}
            {component.price && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Giá tham khảo</h2>
                <div className="text-2xl font-bold text-blue-500">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(component.price)}
                </div>
              </div>
            )}

            {/* Rating if available */}
            {component.rating && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Đánh giá</h2>
                <div className="flex items-center gap-2">
                  <div className="text-xl font-bold">{component.rating}/5</div>
                  <div className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < Math.floor(component.rating || 0) ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              {component.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Engagement Section */}
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Button variant="outline" className="gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{engagementData.likes}</span>
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  <span>{engagementData.shares}</span>
                </Button>
              </div>
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Bình luận</span>
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <CommentsSection />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Author Card */}
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={authorInfo.image} />
                <AvatarFallback>{authorInfo.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-lg">{authorInfo.name}</h3>
                <p className="text-gray-400">Chuyên gia phần cứng</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Chuyên gia về phần cứng và các linh kiện PC cao cấp. Đưa tin mới nhất về công nghệ và xu hướng linh kiện.
            </p>
            <Button className="w-full">Theo dõi tác giả</Button>
          </div>

          {/* Related Components */}
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4">Linh kiện liên quan</h3>
            <div className="space-y-4">
              {relatedComponents.map((related) => (
                <Link
                  key={related.id}
                  href={`/pc-components/${related.id}`}
                  className="block group"
                >
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={related.image}
                        alt={related.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium group-hover:text-blue-400 transition-colors line-clamp-2">
                        {related.title}
                      </h4>
                      <div className="text-sm text-gray-400 mt-1">
                        {formatDate(related.date)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 