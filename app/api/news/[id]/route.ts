import { NextRequest, NextResponse } from 'next/server'
import newsData from '@/data/news.json'

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    // Call to the real backend API
    const BE_LOL_API_URL = process.env.NEXT_PUBLIC_BE_LOL_API_URL || 'http://localhost:3001'
    
    try {
      const response = await fetch(`${BE_LOL_API_URL}/api/news/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(`Error fetching news article: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data.data)
    } catch (error) {
      console.error('Error fetching from BE-LOL API:', error)
      
      // Fallback to static data if API call fails
      const article = (newsData.articles as LegacyNewsItem[]).find(
        (article) => article._id === id || article.id === id || article.slug === id
      )
      
      if (!article) {
        return NextResponse.json(
          { message: `News article with ID ${id} not found` },
          { status: 404 }
        )
      }
      
      // Transform to match BE-LOL data structure
      const transformedArticle = {
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
      };
      
      return NextResponse.json(transformedArticle)
    }
  } catch (error) {
    return NextResponse.json(
      { message: `Error fetching news article: ${error}` },
      { status: 500 }
    )
  }
} 