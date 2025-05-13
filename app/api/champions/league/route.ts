import { NextResponse } from 'next/server'
import championsData from '@/data/champions.json'

interface ChampionsResponse {
  data: Champion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Champion {
  _id?: string;
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  splashUrl: string;
  stats: Record<string, number>;
  abilities: any[];
  tags: string[];
  counters: string[];
  strongAgainst: string[];
  recommendedRunes: any[];
  recommendedItems: any[];
  __v?: number;
}

const BE_LOL_API_URL = process.env.NEXT_PUBLIC_BE_LOL_API_URL

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'
    
    const apiUrl = `${BE_LOL_API_URL}/api/champions?page=${page}&limit=${limit}`
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    
    if (!response.ok) {
      console.error(`API returned error: ${response.status} ${response.statusText}`)
      throw new Error(`API Error: ${response.status}`)
    }
    
    const responseText = await response.text()
    
    let result: ChampionsResponse
    try {
      result = JSON.parse(responseText)
    } catch (parseError) {
      throw new Error('Invalid JSON response')
    }
    
    return NextResponse.json(result.data)
  } catch (error) {
    const pageNum = parseInt(new URL(request.url).searchParams.get('page') || '1', 10)
    const pageSize = parseInt(new URL(request.url).searchParams.get('limit') || '20', 10)
    const startIndex = (pageNum - 1) * pageSize
    const endIndex = startIndex + pageSize
    
    const totalChamps = championsData.league.length
    const paginatedChamps = championsData.league.slice(startIndex, endIndex)
    
    return NextResponse.json({
      data: paginatedChamps,
      total: totalChamps,
      page: pageNum,
      limit: pageSize,
      totalPages: Math.ceil(totalChamps / pageSize)
    })
  }
}