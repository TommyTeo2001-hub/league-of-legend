import { NextResponse } from 'next/server'
import countersData from '@/data/counters.json'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug
  
  // Tìm thông tin counter cho champion này
  const champions = countersData.champions as Record<string, any>
  const championData = champions[slug]
  
  if (!championData) {
    return NextResponse.json(
      { error: `Không tìm thấy thông tin counter cho champion: ${slug}` },
      { status: 404 }
    )
  }
  
  return NextResponse.json({
    name: slug.charAt(0).toUpperCase() + slug.slice(1), // Capitalize first letter
    ...championData
  })
} 