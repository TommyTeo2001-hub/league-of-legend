import { NextResponse } from 'next/server'
import championsData from '@/data/champions.json' // Keep as fallback

export async function GET() {
  try {
    // Hiện tại chỉ trả về dữ liệu tĩnh
    // Trong tương lai có thể tích hợp với BE-LOL API nếu hỗ trợ Wild Rift
    return NextResponse.json(championsData.wildrift)
  } catch (error) {
    console.error('Error fetching Wild Rift champions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Wild Rift champions' },
      { status: 500 }
    )
  }
}