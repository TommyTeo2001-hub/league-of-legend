import { NextResponse } from 'next/server'
import matchHistoryData from '@/data/match-history.json'

export async function GET() {
  return NextResponse.json(matchHistoryData.matches)
}