import { NextResponse } from 'next/server'
import championsData from '@/data/champions.json' // Keep as fallback

export async function GET() {
  try {
    // Hiện tại chỉ trả về dữ liệu tĩnh
    // Trong tương lai có thể tích hợp với BE-LOL API nếu hỗ trợ TFT
  return NextResponse.json(championsData.tft)
  } catch (error) {
    console.error('Error fetching TFT champions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch TFT champions' },
      { status: 500 }
    )
  }
}