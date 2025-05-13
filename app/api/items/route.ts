import { NextResponse } from 'next/server'
import itemsData from '@/data/items.json'

export async function GET() {
  return NextResponse.json(itemsData.items)
}