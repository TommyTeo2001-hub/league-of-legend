"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, User, Clock, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { fetchNewsById, NewsArticle } from '@/lib/api'
import NewsCommentsSection from './components/comments-section'

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const [newsArticle, setNewsArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadNewsArticle = async () => {
      try {
        setLoading(true)
        const data = await fetchNewsById(params.id)
        setNewsArticle(data)
      } catch (err) {
        console.error('Error loading news article:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadNewsArticle()
  }, [params.id])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Format content with newlines preserved
  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4">
        {paragraph}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-4">Đang tải bài viết...</h2>
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
          <p className="text-gray-300 mb-2">Không thể tải bài viết. Vui lòng thử lại sau.</p>
          <div className="text-sm text-gray-400 font-mono bg-black/30 p-4 rounded-lg">
            {error.message}
          </div>
        </div>
      </div>
    )
  }

  if (!newsArticle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#1a1a1c] border border-[#2a2a30] rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h2>
          <p className="text-gray-300 mb-4">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link href="/news">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại trang tin tức
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/news">
          <Button variant="outline" className="bg-[#1a1a1c] border-[#2a2a30]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại trang tin tức
          </Button>
        </Link>
      </div>

      {/* Article header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{newsArticle.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{newsArticle.author.name}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(newsArticle.publishedAt)}</span>
          </div>
          {newsArticle.tags && newsArticle.tags.map(tag => (
            <Badge key={tag} variant="outline" className="bg-[#1a1a1c] border-[#2a2a30]">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Featured image */}
      <div className="relative h-[400px] lg:h-[500px] mb-8 rounded-xl overflow-hidden">
        <Image
          src={newsArticle.imageUrl}
          alt={newsArticle.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Article content */}
      <div className="max-w-3xl mx-auto mb-16">
        <div className="prose prose-invert prose-lg">
          {formatContent(newsArticle.content)}
        </div>
      </div>
      
      {/* Comments section */}
      <div className="max-w-3xl mx-auto mt-16">
        <NewsCommentsSection />
      </div>
    </div>
  )
}