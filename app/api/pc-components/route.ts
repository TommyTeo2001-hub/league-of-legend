import { NextRequest, NextResponse } from "next/server"
import pcComponentsData from "@/data/pc-components.json"

// Define legacy article format from static data
interface LegacyPCComponent {
  id?: string;
  _id?: string;
  title: string;
  excerpt?: string;
  description?: string;
  content: string;
  image?: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  price?: string | number;
  type?: string;
  author?: string | {
    name: string;
    image?: string;
  };
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Call the real backend API
    const BE_LOL_API_URL = process.env.NEXT_PUBLIC_BE_LOL_API_URL || 'http://localhost:3001'
    
    try {
      // Using the correct endpoint for PC builds
      const response = await fetch(`${BE_LOL_API_URL}/api/pc-build/builds?page=${page}&limit=${limit}`, {
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
      
      // Create fallback data with appropriate structure
      const builds = (pcComponentsData.articles as LegacyPCComponent[]).map(article => ({
        _id: article._id || article.id || `fallback-${Math.random().toString(36).substring(2, 9)}`,
        name: article.title,
        description: article.excerpt || article.description || '',
        content: article.content,
        imageUrl: article.image || article.imageUrl || '',
        tags: Array.isArray(article.tags) ? article.tags : 
              article.category ? [article.category] : 
              article.type ? [article.type] : [],
        isPublic: true,
        user: {
          _id: 'user-1',
          name: typeof article.author === 'string' ? article.author : 
                article.author ? article.author.name : 'Admin'
        },
        createdAt: article.createdAt || article.date || new Date().toISOString(),
        updatedAt: article.updatedAt || article.date || new Date().toISOString()
      }));
      
      // Calculate pagination for the fallback data
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedBuilds = builds.slice(startIndex, endIndex)
      
      // Return a properly formatted fallback response
      return NextResponse.json({
        data: {
          builds: paginatedBuilds
        },
        total: builds.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil(builds.length / limit)
      })
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { message: `Error fetching PC components: ${error}` },
      { status: 500 }
    )
  }
}
