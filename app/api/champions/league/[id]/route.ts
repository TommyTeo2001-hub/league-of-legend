import { NextResponse } from 'next/server'
import championsData from '@/data/champions.json' // Keep as fallback
import { mapBEChampionToFrontend } from '@/lib/champions-utils'

// BE-LOL API base URL
const BE_LOL_API_URL = process.env.NEXT_PUBLIC_BE_LOL_API_URL

// Type for BE champion abilities
interface BEAbility {
  name: string;
  description: string;
  imageUrl: string;
}

// Type for BE champion
interface BEChampion {
  _id?: string;
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  splashUrl: string;
  stats: Record<string, number>;
  abilities: BEAbility[];
  tags: string[];
  counters?: string[];
  strongAgainst?: string[];
  recommendedRunes?: any[];
  recommendedItems?: any[];
  __v?: number;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!BE_LOL_API_URL) {
      const champion = championsData.league.find(c => c.id === params.id)
      if (!champion) {
        return NextResponse.json({ error: 'Champion not found' }, { status: 404 })
      }
      return NextResponse.json(champion)
    }
    
    const searchResponse = await fetch(`${BE_LOL_API_URL}/api/champions/search/${params.id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    const responseText = await searchResponse.text()
    
    let result: { data: BEChampion | BEChampion[] }
    try {
      result = JSON.parse(responseText)
    } catch (parseError) {
      throw new Error('Response không phải JSON hợp lệ')
    }
    let beChampion: BEChampion | null = null
    
    if (Array.isArray(result.data)) {
      beChampion = result.data.find(c => c.id === params.id) || result.data[0]
    } else {
      beChampion = result.data
    }
    
    if (!beChampion) {
      return NextResponse.json(
        { error: 'Champion not found' },
        { status: 404 }
      )
    }
    
    console.log(result.data)
    const uiChampion = mapBEChampionToFrontend(beChampion)
    
    return NextResponse.json(uiChampion)
    
  } catch (error) {
    console.error(`Error fetching champion ${params.id} from BE-LOL API, using fallback data:`, error)
    
    const champion = championsData.league.find(c => c.id === params.id)
    
    if (!champion) {
      return NextResponse.json(
        { error: 'Champion not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(champion)
  }
}