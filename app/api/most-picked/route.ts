import { NextResponse } from 'next/server'
import mostPickedData from '@/data/most-picked.json'

export async function GET() {
  return NextResponse.json(mostPickedData.champions)
}