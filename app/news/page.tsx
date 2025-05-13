"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { fetchNews, NewsArticle, NewsResponse } from '@/lib/api'

export default function NewsPage() {
  const [newsData, setNewsData] = useState<NewsResponse | null>(null)
  const [featuredNews, setFeaturedNews] = useState<NewsArticle | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch news data from API
  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true)
        const data = await fetchNews(currentPage, 10)
        setNewsData(data)
        
        // Lấy bài viết nổi bật (bài đầu tiên)
        if (data.data.length > 0) {
          setFeaturedNews(data.data[0])
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

  // Lọc tin tức theo searchQuery
  const filteredNews = newsData?.data.filter(news => 
    news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hiển thị loading
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

  // Hiển thị lỗi
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

  // Hiển thị khi không có dữ liệu
  if (!newsData?.data.length) {
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

  // Hiển thị giá trị readTime hoặc giá trị mặc định
  const getReadTime = (article: NewsArticle) => {
    return article.readTime || '5 min read';
  };

  // Xử lý tác giả (có thể là object hoặc string)
  const getAuthor = (article: NewsArticle) => {
    if (typeof article.author === 'string') {
      return article.author;
    }
    return article.author.name;
  };

  // Mảng tin tức còn lại (bỏ qua tin nổi bật)
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
            href={`/news/${featuredNews.id}`}
            className="block bg-[#121214] border border-[#2a2a30] rounded-xl overflow-hidden hover:border-blue-500 transition-colors"
          >
            <div className="relative h-[400px]">
              <Image
                src={featuredNews.image}
                alt={featuredNews.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121214] to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <Badge className="bg-blue-600 mb-4">{featuredNews.category}</Badge>
                <h2 className="text-3xl font-bold mb-4">{featuredNews.title}</h2>
                <p className="text-gray-300 mb-4 max-w-2xl">{featuredNews.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{getAuthor(featuredNews)}</span>
                  <span>•</span>
                  <span>{formatDate(featuredNews.date)}</span>
                  <span>•</span>
                  <span>{getReadTime(featuredNews)}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* News Categories */}
      <Tabs defaultValue="all" className="mb-16">
        <TabsList className="bg-[#1a1a1c] border border-[#2a2a30] p-1 mb-8">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Tất cả
          </TabsTrigger>
          <TabsTrigger 
            value="patch" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Cập nhật
          </TabsTrigger>
          <TabsTrigger 
            value="esports" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Esports
          </TabsTrigger>
          <TabsTrigger 
            value="dev" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Dev
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {remainingNews.map((news) => (
              <Link
                key={news.id}
                href={`/news/${news.id}`}
                className="bg-[#121214] border border-[#2a2a30] rounded-xl overflow-hidden hover:border-blue-500 transition-colors"
              >
                <div className="relative h-48">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <Badge className="mb-3" variant="outline">{news.category}</Badge>
                  <h3 className="text-xl font-bold mb-2">{news.title}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">{news.excerpt}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span>{getAuthor(news)}</span>
                    <span>•</span>
                    <span>{formatDate(news.date)}</span>
                    <span>•</span>
                    <span>{getReadTime(news)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patch" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {remainingNews
              .filter(news => news.category.toLowerCase() === "patch notes" || news.category.toLowerCase() === "cập nhật")
              .map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.id}`}
                  className="bg-[#121214] border border-[#2a2a30] rounded-xl overflow-hidden hover:border-blue-500 transition-colors"
                >
                  <div className="relative h-48">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <Badge className="mb-3" variant="outline">{news.category}</Badge>
                    <h3 className="text-xl font-bold mb-2">{news.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{news.excerpt}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{getAuthor(news)}</span>
                      <span>•</span>
                      <span>{formatDate(news.date)}</span>
                      <span>•</span>
                      <span>{getReadTime(news)}</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="esports" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {remainingNews
              .filter(news => news.category.toLowerCase() === "esports")
              .map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.id}`}
                  className="bg-[#121214] border border-[#2a2a30] rounded-xl overflow-hidden hover:border-blue-500 transition-colors"
                >
                  <div className="relative h-48">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <Badge className="mb-3" variant="outline">{news.category}</Badge>
                    <h3 className="text-xl font-bold mb-2">{news.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{news.excerpt}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{getAuthor(news)}</span>
                      <span>•</span>
                      <span>{formatDate(news.date)}</span>
                      <span>•</span>
                      <span>{getReadTime(news)}</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="dev" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {remainingNews
              .filter(news => news.category.toLowerCase() === "dev")
              .map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.id}`}
                  className="bg-[#121214] border border-[#2a2a30] rounded-xl overflow-hidden hover:border-blue-500 transition-colors"
                >
                  <div className="relative h-48">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <Badge className="mb-3" variant="outline">{news.category}</Badge>
                    <h3 className="text-xl font-bold mb-2">{news.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{news.excerpt}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{getAuthor(news)}</span>
                      <span>•</span>
                      <span>{formatDate(news.date)}</span>
                      <span>•</span>
                      <span>{getReadTime(news)}</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {newsData && newsData.totalPages > 1 && (
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
            
            {[...Array(newsData.totalPages)].map((_, i) => (
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
              onClick={() => setCurrentPage(p => Math.min(newsData.totalPages, p + 1))}
              disabled={currentPage === newsData.totalPages}
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