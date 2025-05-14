"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { fetchNews, NewsArticle, NewsResponse } from '@/lib/api'

export default function NewsPage() {
  const [newsData, setNewsData] = useState<NewsArticle[] | null>(null)
  const [featuredNews, setFeaturedNews] = useState<NewsArticle | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true)
        const res = await fetchNews(currentPage, 10)
        setNewsData(res.data.articles)
        setTotalPages(res.totalPages)
        if (res.data.articles.length > 0) {
          setFeaturedNews(res.data.articles[0])
        }
      } catch (err) {
        console.error('Lỗi khi tải tin tức:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [currentPage])

  // Filter news by search query
  const filteredNews = newsData?.filter(news => 
    news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (news.tags && news.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  if (loading && !newsData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Đang tải tin tức...</h2>
            <p className="text-gray-400">Vui lòng đợi trong giây lát</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error
  if (error && !newsData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500/20 border border-red-500 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Đã xảy ra lỗi</h2>
          <p className="text-gray-300 mb-2">Không thể tải tin tức. Vui lòng thử lại sau.</p>
          <div className="text-sm text-gray-400 font-mono bg-black/30 p-4 rounded-lg">
            {error.message}
          </div>
        </div>
      </div>
    )
  }

  // Show when no data
  if (!newsData?.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Không có tin tức</h2>
            <p className="text-gray-400">Hiện chưa có tin tức nào được đăng tải</p>
          </div>
        </div>
      </div>
    )
  }

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} ngày trước`;
    }
  };

  // Get remaining news
  const remainingNews = filteredNews?.slice(featuredNews ? 1 : 0) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tin tức League of Legends</h1>
        <p className="text-gray-400">Cập nhật tin tức mới nhất về League of Legends</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-xl">
          <Input
            type="text"
            placeholder="Tìm kiếm tin tức..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1a1a1c] border-[#2a2a30] focus-visible:ring-blue-500"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Featured News */}
      {featuredNews && !searchQuery && (
        <div className="mb-12">
          <Link 
            href={`/news/${featuredNews._id}`}
            className="block bg-[#121214] border border-[#2a2a30] rounded-xl overflow-hidden hover:border-blue-500 transition-colors"
          >
            <div className="relative h-[400px]">
              <Image
                src={featuredNews.imageUrl}
                alt={featuredNews.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121214] to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                {featuredNews.tags && featuredNews.tags.length > 0 && (
                  <div className="mb-4">
                    <Badge className="bg-blue-600">{featuredNews.tags[0].toUpperCase()}</Badge>
                  </div>
                )}
                <h2 className="text-3xl font-bold mb-4">{featuredNews.title}</h2>
                <p className="text-gray-300 mb-4 max-w-2xl">{featuredNews.summary}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{featuredNews.author.name}</span>
                  <span>•</span>
                  <span>{formatDate(featuredNews.publishedAt)}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* News List */}
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {remainingNews.map((news) => (
            <Link
              key={news._id}
              href={`/news/${news._id}`}
              className="bg-[#121214] border border-[#2a2a30] rounded-xl overflow-hidden hover:border-blue-500 transition-colors"
            >
              <div className="relative h-48">
                <Image
                  src={news.imageUrl}
                  alt={news.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                {news.tags && news.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {news.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline">{tag.toUpperCase()}</Badge>
                    ))}
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{news.title}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{news.summary}</p>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span>{news.author.name}</span>
                  <span>•</span>
                  <span>{formatDate(news.publishedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
            
            {[...Array(totalPages)].map((_, i) => (
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
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
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