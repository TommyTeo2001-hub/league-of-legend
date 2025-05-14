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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    // Call to the real backend API
    const BE_LOL_API_URL = process.env.NEXT_PUBLIC_BE_LOL_API_URL || 'http://localhost:3001'
    
    try {
      // Try fetching the build data first
      const response = await fetch(`${BE_LOL_API_URL}/api/pc-build/builds/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.ok) {
        // If we get a 500 error that might be due to the strictPopulate error, log it
        // but don't throw yet - we'll fall back to static data
        console.error(`Error fetching PC component: ${response.status}`)
        if (response.status === 500) {
          // This might be the strictPopulate error, so fall back to static data
          throw new Error("Possible strictPopulate error, falling back to static data")
        } else {
          throw new Error(`Error fetching PC component: ${response.status}`)
        }
      }

      const data = await response.json()
      return NextResponse.json(data.data)
    } catch (error) {
      console.error('Error fetching from BE-LOL API:', error)
      
      // Fallback to static data if API call fails
      const article = (pcComponentsData.articles as LegacyPCComponent[]).find(
        (article) => article._id === id || article.id === id
      )
      
      if (!article) {
        return NextResponse.json(
          { message: `PC component with ID ${id} not found` },
          { status: 404 }
        )
      }
      
      // Transform to match BE-LOL data structure
      const component = {
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
      };
      
      return NextResponse.json(component)
    }
  } catch (error) {
    return NextResponse.json(
      { message: `Error fetching PC component: ${error}` },
      { status: 500 }
    )
  }
}
