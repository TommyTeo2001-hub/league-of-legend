import { NextResponse } from 'next/server'
import countersData from '@/data/counters.json'

export async function GET() {
  return NextResponse.json(countersData.champions)
}