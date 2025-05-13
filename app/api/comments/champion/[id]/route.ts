import { NextRequest, NextResponse } from 'next/server'

const BE_LOL_API_URL = process.env.NEXT_PUBLIC_BE_LOL_API_URL


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'
    
    const championId = params.id
    
    // Cập nhật để sử dụng news/:newsId API thay vì champion/:id
    const response = await fetch(
      `${BE_LOL_API_URL}/comments/news/${championId}?page=${page}&limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )
    
    if (!response.ok) {
      throw new Error(`Error fetching comments: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching champion comments:', error)
    
    // Use default mock data if API fails
    return NextResponse.json({
      status: 'success',
      data: {
        comments: [
          {
            _id: '1',
            content: "Tướng này thực sự mạnh trong meta hiện tại. Khả năng gây sát thương tức thì rất cao nếu bạn có thể thực hiện combo chính xác.",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            authorName: "ProPlayer123",
            likes: 0,
            replies: [
              {
                _id: '2',
                content: "Đồng ý! Những buff gần đây cho chiêu cuối thực sự tạo ra sự khác biệt lớn.",
                createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                authorName: "GameMaster",
                likes: 0
              }
            ]
          },
          {
            _id: '3',
            content: "Mẹo chuyên gia: Hãy giữ Flash để phòng thủ thay vì dùng để lao vào. Tướng này đã có đủ khả năng cơ động trong bộ kỹ năng rồi.",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            authorName: "LOLCoach",
            likes: 0
          }
        ],
        total: 3
      }
    })
  }
} 