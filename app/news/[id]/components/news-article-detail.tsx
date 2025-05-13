"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Share2, ThumbsUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { fetchNewsById, fetchNews, NewsArticle } from '@/lib/api'

export default function NewsArticleDetail({ id }: { id: string }) {
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true)
        const data = await fetchNewsById(id)
        setArticle(data)
        
        // Lấy các bài viết liên quan
        const allArticles = await fetchNews(1, 4)
        const related = allArticles.data
          .filter((a: NewsArticle) => a.id !== id)
          .slice(0, 3)
        setRelatedArticles(related)
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu bài viết:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [id])

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
            Không thể tải thông tin bài viết. Vui lòng thử lại sau.
          </p>
          <div className="text-sm text-gray-400 font-mono bg-black/30 p-4 rounded-lg text-left">
            {error.message}
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Không tìm thấy bài viết</h2>
          <p className="text-gray-300 mb-4">
            Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link 
            href="/news"
            className="inline-flex items-center gap-2 text-blue-400 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại trang tin tức
          </Link>
        </div>
      </div>
    )
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to get author
  const getAuthor = (author: string | { name: string; image?: string }) => {
    if (typeof author === 'string') {
      return { name: author, image: undefined };
    }
    return author;
  };

  const authorInfo = getAuthor(article.author);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link 
        href="/news"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách tin tức
      </Link>

      {/* Article Header */}
      <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <Badge className="bg-blue-600 mb-4">{article.category}</Badge>
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <p className="text-gray-300 mb-4 max-w-2xl">{article.excerpt}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={authorInfo.image} />
                <AvatarFallback>{authorInfo.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{authorInfo.name}</div>
                <div className="text-sm text-gray-400">
                  {formatDate(article.date)}
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
            <div className="prose prose-invert max-w-none">
              {article.content.split('\n\n').map((paragraph, index) => (
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
                  <span>Thích</span>
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  <span>Chia sẻ</span>
                </Button>
              </div>
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Bình luận</span>
              </Button>
            </div>
          </div>
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
                <p className="text-gray-400">Biên tập viên</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Chuyên viết về tin tức, cập nhật và sự kiện mới nhất trong League of Legends.
            </p>
            <Button className="w-full">Theo dõi tác giả</Button>
          </div>

          {/* Related Articles */}
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4">Bài viết liên quan</h3>
            <div className="space-y-4">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/news/${related.id}`}
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