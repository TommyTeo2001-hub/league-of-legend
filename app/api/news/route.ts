import { NextRequest, NextResponse } from 'next/server'
import newsData from '@/data/news.json'

// Define types to match backend schema
interface NewsArticle {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  imageUrl: string;
  tags: string[];
  author: {
    _id: string;
    name: string;
  };
  published: boolean;
  publishedAt: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// Define legacy article format from static data
interface LegacyNewsItem {
  _id?: string;
  id?: string;
  title: string;
  slug?: string;
  excerpt?: string;
  summary?: string;
  content: string;
  image?: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  author: string | {
    name: string;
    image?: string;
  };
  date?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  viewCount?: number;
  readTime?: string;
  __v?: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1') 
    const limit = parseInt(searchParams.get('limit') || '10')

    // Call the real backend API
    const BE_LOL_API_URL = process.env.NEXT_PUBLIC_BE_LOL_API_URL || 'http://localhost:3001'
    
    try {
      const response = await fetch(`${BE_LOL_API_URL}/api/news?page=${page}&limit=${limit}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      
      // Return the data as is from the API
      return NextResponse.json(data)
    } catch (error) {
      console.error('Error fetching from BE-LOL API:', error)
      
      // Create fallback data with structure matching backend
      const articles = (newsData.articles as LegacyNewsItem[]).map(article => ({
        _id: article._id || article.id || `fallback-${Math.random().toString(36).substring(2, 9)}`,
        title: article.title,
        slug: article.slug || article.title.toLowerCase().replace(/\s+/g, '-'),
        content: article.content,
        summary: article.excerpt || article.summary || article.content.substring(0, 150),
        imageUrl: article.image || article.imageUrl || '',
        tags: Array.isArray(article.tags) ? article.tags : 
              article.category ? [article.category] : [],
        author: {
          _id: 'author-1',
          name: typeof article.author === 'string' ? article.author : article.author.name
        },
        published: true,
        publishedAt: article.publishedAt || article.date || new Date().toISOString(),
        viewCount: article.viewCount || 0,
        createdAt: article.createdAt || article.date || new Date().toISOString(),
        updatedAt: article.updatedAt || article.date || new Date().toISOString()
      }));
      
      // Calculate pagination for the fallback data
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedArticles = articles.slice(startIndex, endIndex)
      
      // Return a properly formatted fallback response
      return NextResponse.json({
        data: {
          articles: paginatedArticles
        },
        total: articles.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil(articles.length / limit)
      })
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { message: `Error fetching news: ${error}` },
      { status: 500 }
    )
  }
}