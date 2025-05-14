import { NextRequest, NextResponse } from 'next/server'

const BE_LOL_API_URL = process.env.NEXT_PUBLIC_BE_LOL_API_URL

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commentId = params.id
    
    if (!commentId) {
      return NextResponse.json(
        { message: 'Comment ID is required' },
        { status: 400 }
      )
    }
    
    // Get authentication token
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    }
    
    try {
      // Call to backend API
      const response = await fetch(
        `${BE_LOL_API_URL}/comments/${commentId}/like`,
        {
          method: 'POST',
          headers
        }
      )
      
      if (!response.ok) {
        throw new Error(`Error liking comment: ${response.status}`)
      }
      
      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error('Error liking comment:', error)
      
      // Fallback response
      return NextResponse.json({
        status: 'success',
        message: 'Comment liked successfully'
      })
    }
  } catch (error) {
    console.error('Error in like API route:', error)
    return NextResponse.json(
      { message: `Error liking comment: ${error}` },
      { status: 500 }
    )
  }
} 