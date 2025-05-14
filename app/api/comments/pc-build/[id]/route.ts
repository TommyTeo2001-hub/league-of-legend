import { NextRequest, NextResponse } from 'next/server'

// Define Comment interface based on the backend schema
interface Comment {
  _id: string;
  pcBuildId: string;
  newsId: string | null;
  authorName: string;
  content: string;
  userId?: string;
  createdAt: string;
  isApproved: boolean;
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
      const response = await fetch(`${BE_LOL_API_URL}/api/comments/pc-build/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(`Error fetching comments: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error('Error fetching from BE-LOL API:', error)
      
      // Fallback data
      const fallbackComments: Comment[] = [
        {
          _id: 'comment-1',
          pcBuildId: id,
          newsId: null,
          authorName: 'Người dùng ẩn danh',
          content: 'Bài viết rất hay, cảm ơn bạn đã chia sẻ!',
          createdAt: new Date().toISOString(),
          isApproved: true
        }
      ]
      
      return NextResponse.json({ data: fallbackComments })
    }
  } catch (error) {
    return NextResponse.json(
      { message: `Error fetching comments: ${error}` },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    
    const { content, authorName } = body
    
    if (!content || !authorName) {
      return NextResponse.json(
        { message: 'Content and authorName are required' },
        { status: 400 }
      )
    }
    
    // Call to the real backend API
    const BE_LOL_API_URL = process.env.NEXT_PUBLIC_BE_LOL_API_URL || 'http://localhost:3001'
    
    try {
      const response = await fetch(`${BE_LOL_API_URL}/api/comments/pc-build/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          authorName
        }),
      })

      if (!response.ok) {
        throw new Error(`Error creating comment: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error('Error posting to BE-LOL API:', error)
      
      // Fallback response
      const fallbackComment: Comment = {
        _id: `comment-${Math.random().toString(36).substring(2, 9)}`,
        pcBuildId: id,
        newsId: null,
        authorName,
        content,
        createdAt: new Date().toISOString(),
        isApproved: true
      }
      
      return NextResponse.json({ data: fallbackComment })
    }
  } catch (error) {
    return NextResponse.json(
      { message: `Error creating comment: ${error}` },
      { status: 500 }
    )
  }
} 