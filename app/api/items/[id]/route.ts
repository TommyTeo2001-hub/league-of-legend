import { NextResponse } from 'next/server'
import itemsData from '@/data/items.json'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  // Tìm item theo id
  const item = itemsData.items.find((item: any) => item.id === id)

  if (!item) {
    return NextResponse.json(
      { error: `Item với id ${id} không tồn tại` },
      { status: 404 }
    )
  }

  return NextResponse.json(item)
} 