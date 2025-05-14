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
        
        // Ensure the component data has all required fields, adding defaults if needed
        const sanitizedData: PCComponent = {
          _id: data._id || id,
          name: data.name || 'Untitled Component',
          description: data.description || '',
          content: data.content || '',
          imageUrl: data.imageUrl || '/images/placeholder.jpg',
          tags: Array.isArray(data.tags) ? data.tags : [],
          isPublic: data.isPublic !== undefined ? data.isPublic : true,
          user: data.user || { _id: 'user-1', name: 'Admin' },
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        }
        
        setComponent(sanitizedData)
        
        // Load related components
        try {
          const allComponents = await fetchPCComponents(1, 4)
          const related = allComponents.data.builds
            .filter((c: PCComponent) => c._id !== id)
            .slice(0, 3)
          setRelatedComponents(related)
        } catch (relatedErr) {
          console.error('Error loading related components:', relatedErr)
          // Don't set the main error for related components failing
          setRelatedComponents([])
        }
      } catch (err) {
        console.error('Error loading component data:', err)
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
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'Ngày không hợp lệ';
    }
  };

  // Get tag badge or fallback
  const getTagBadge = (component: PCComponent) => {
    if (component.tags && component.tags.length > 0) {
      return <Badge className="bg-blue-600 mb-4">{component.tags[0].toUpperCase()}</Badge>;
    }
    return <Badge className="bg-blue-600 mb-4">PC BUILD</Badge>;
  };

  // Fake data for engagement
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
          src={component.imageUrl || '/images/placeholder.jpg'}
          alt={component.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          {getTagBadge(component)}
          <h1 className="text-4xl font-bold mb-4">{component.name}</h1>
          <p className="text-gray-300 mb-4 max-w-2xl">{component.description}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{component.user?.name?.[0] || 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{component.user?.name || 'Admin'}</div>
                <div className="text-sm text-gray-400">
                  {formatDate(component.createdAt)}
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
            {/* Tags */}
            {component.tags && component.tags.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {component.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              <div className="mb-8 text-gray-300" dangerouslySetInnerHTML={{ __html: component.content.replace(/\n/g, '<br/>') }} />
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
          {/* Author Info */}
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback>{component.user?.name?.[0] || 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-lg">{component.user?.name || 'Admin'}</h3>
                <p className="text-gray-400">Tác giả</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Chia sẻ thông tin và đánh giá về linh kiện và xây dựng PC.
            </p>
          </div>

          {/* Status */}
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4">Trạng thái</h3>
            <div className="flex items-center gap-2 text-green-500">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Đã đăng tải</span>
            </div>
          </div>

          {/* Related Components */}
          {relatedComponents.length > 0 && (
            <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Bài viết liên quan</h3>
              <div className="space-y-4">
                {relatedComponents.map((relatedComponent) => (
                  <Link 
                    key={relatedComponent._id}
                    href={`/pc-components/${relatedComponent._id}`}
                    className="flex items-center gap-3 hover:bg-[#1a1a1c] p-2 rounded-lg transition-colors"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={relatedComponent.imageUrl || '/images/placeholder.jpg'}
                        alt={relatedComponent.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{relatedComponent.name}</h4>
                      <p className="text-sm text-gray-400 line-clamp-1">{relatedComponent.description}</p>
                    </div>
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