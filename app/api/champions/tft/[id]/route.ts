import { NextResponse } from 'next/server'
import championsData from '@/data/champions.json' // Keep as fallback

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Hiện tại chỉ trả về dữ liệu tĩnh
    // Trong tương lai có thể tích hợp với BE-LOL API nếu hỗ trợ TFT
  const champion = championsData.tft.find(c => c.id === params.id)
    
  if (!champion) {
    return NextResponse.json(
      { error: 'Champion not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(champion)
  } catch (error) {
    console.error(`Error fetching TFT champion ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch champion' },
      { status: 500 }
    )
  }
}