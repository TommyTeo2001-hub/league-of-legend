import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commentId = params.id
    
    // Get authentication token
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Vì BE-LOL không có endpoint /comments/:id/like, ta triển khai nội bộ
    // Để phát triển thực tế, ta sẽ cần bổ sung endpoint này vào BE-LOL
    
    // Giả lập thành công khi like comment
    return NextResponse.json({
      status: 'success',
      data: {
        _id: commentId,
        likes: 1,
        message: 'Liked comment successfully'
      }
    })
  } catch (error) {
    console.error('Error liking comment:', error)
    
    // Return error response
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to like comment' 
      },
      { status: 500 }
    )
  }
} 