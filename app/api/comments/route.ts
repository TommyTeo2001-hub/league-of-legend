import { NextRequest, NextResponse } from 'next/server'

const BE_LOL_API_URL = process.env.NEXT_PUBLIC_BE_LOL_API_URL

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'news'
    const id = searchParams.get('id')
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'
    
    if (!id) {
      return NextResponse.json(
        { message: 'ID parameter is required' },
        { status: 400 }
      )
    }
    
    // Map the type to the correct backend endpoint
    let endpoint = ''
    
    switch (type) {
      case 'champion':
        endpoint = `/comments/news/${id}?page=${page}&limit=${limit}`
        break
      case 'wildrift-champion':
        endpoint = `/comments/news/${id}?page=${page}&limit=${limit}&type=wildrift`
        break
      case 'tft-champion':
        endpoint = `/comments/news/${id}?page=${page}&limit=${limit}&type=tft`
        break
      case 'news':
        endpoint = `/comments/news/${id}?page=${page}&limit=${limit}`
        break
      case 'pc-build':
        endpoint = `/comments/pc-build/${id}?page=${page}&limit=${limit}`
        break
      default:
        endpoint = `/comments/news/${id}?page=${page}&limit=${limit}`
    }
    
    try {
      const response = await fetch(`${BE_LOL_API_URL}${endpoint}`, {
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
      
      // Return fallback data
      return NextResponse.json({
        status: 'success',
        data: {
          comments: [],
          total: 0
        }
      })
    }
  } catch (error) {
    return NextResponse.json(
      { message: `Error fetching comments: ${error}` },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, id, authorName, content } = body
    
    if (!id || !content || !authorName) {
      return NextResponse.json(
        { message: 'id, content, and authorName are required' },
        { status: 400 }
      )
    }
    
    // Get authentication token if present
    const authHeader = request.headers.get('authorization')
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (authHeader) {
      headers['Authorization'] = authHeader
    }
    
    // Map the type to the correct backend endpoint
    let endpoint = ''
    let payload: any = {
      authorName,
      content
    }
    
    switch (type) {
      case 'champion':
        endpoint = `/comments/news/${id}`
        break
      case 'wildrift-champion':
        endpoint = `/comments/news/${id}`
        payload.type = 'wildrift'
        break
      case 'tft-champion':
        endpoint = `/comments/news/${id}`
        payload.type = 'tft'
        break
      case 'news':
        endpoint = `/comments/news/${id}`
        break
      case 'pc-build':
        endpoint = `/comments/pc-build/${id}`
        break
      default:
        endpoint = `/comments/news/${id}`
    }
    
    try {
      const response = await fetch(
        `${BE_LOL_API_URL}${endpoint}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        }
      )
      
      if (!response.ok) {
        throw new Error(`Error posting comment: ${response.status}`)
      }
      
      const data = await response.json()
      
      return NextResponse.json(data)
    } catch (error) {
      console.error('Error posting comment:', error)
      
      // Return mock response for fallback
      return NextResponse.json({
        status: 'success',
        data: {
          _id: Date.now().toString(),
          content: content || 'Comment content',
          createdAt: new Date().toISOString(),
          authorName: authorName || 'Khách',
          likes: 0
        }
      })
    }
  } catch (error) {
    console.error('Error posting comment:', error)
    
    return NextResponse.json(
      { message: `Error posting comment: ${error}` },
      { status: 500 }
    )
  }
} 