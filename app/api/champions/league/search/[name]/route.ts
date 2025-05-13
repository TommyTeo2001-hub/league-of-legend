import { NextResponse } from 'next/server'
import { mapBEChampionToFrontend } from '@/lib/champions-utils'
import championsData from '@/data/champions.json'

interface BEChampion {
  _id?: string;
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  splashUrl: string;
  stats: Record<string, number>;
  abilities: Array<{
    name: string;
    description: string;
    imageUrl: string;
  }>;
  tags: string[];
  counters?: string[];
  strongAgainst?: string[];
  recommendedRunes?: any[];
  recommendedItems?: any[];
  __v?: number;
}

const BE_LOL_API_URL = process.env.NEXT_PUBLIC_BE_LOL_API_URL

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    if (!BE_LOL_API_URL) {
      console.log('BE_LOL_API_URL không được cấu hình, sử dụng dữ liệu fallback')
      const championName = params.name.toLowerCase()
      const champion = championsData.league.find(c => 
        c.name.toLowerCase().includes(championName)
      )
      if (!champion) {
        return NextResponse.json({ error: 'Champion not found' }, { status: 404 })
      }
      return NextResponse.json(champion)
    }
    
    console.log(`Gọi API: ${BE_LOL_API_URL}/api/champions/search/${params.name}`)
    
    const response = await fetch(`${BE_LOL_API_URL}/api/champions/search/${params.name}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    
    if (!response.ok) {
      console.error(`API trả về lỗi: ${response.status} ${response.statusText}`)
      
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Champion not found' },
          { status: 404 }
        )
      }
      
      const responseText = await response.text()
      console.error('Response content:', responseText.substring(0, 200) + '...')
      
      throw new Error(`Lỗi API: ${response.status}`)
    }
    
    const responseText = await response.text()
    
    let result: { data: BEChampion | BEChampion[] }
    try {
      result = JSON.parse(responseText)
    } catch (parseError) {
      throw new Error('Response không phải JSON hợp lệ')
    }
    
    let champions: BEChampion[] = []
    
    if (Array.isArray(result.data)) {
      champions = result.data
    } else if (result.data) {
      champions = [result.data]
    }
    
    if (champions.length === 0) {
      return NextResponse.json(
        { error: 'Champion not found' },
        { status: 404 }
      )
    }
    
    const uiChampions = champions.map(mapBEChampionToFrontend)
    
    return NextResponse.json(uiChampions.length === 1 ? uiChampions[0] : uiChampions)
    
  } catch (error) {
    const championName = params.name.toLowerCase()
    const matchingChampions = championsData.league.filter(c => 
      c.name.toLowerCase().includes(championName)
    )
    
    if (matchingChampions.length === 0) {
      return NextResponse.json(
        { error: 'Champion not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(matchingChampions.length === 1 ? matchingChampions[0] : matchingChampions)
  }
} 