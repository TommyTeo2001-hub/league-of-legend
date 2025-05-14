import { NextRequest, NextResponse } from 'next/server'

// Define interface for champion data
export interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  tags: string[];
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  partype: string;
  stats: {
    hp: number;
    hpperlevel: number;
    mp: number;
    mpperlevel: number;
    movespeed: number;
    armor: number;
    armorperlevel: number;
    spellblock: number;
    spellblockperlevel: number;
    attackrange: number;
    hpregen: number;
    hpregenperlevel: number;
    mpregen: number;
    mpregenperlevel: number;
    crit: number;
    critperlevel: number;
    attackdamage: number;
    attackdamageperlevel: number;
    attackspeedperlevel: number;
    attackspeed: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const searchQuery = searchParams.get('search') || ''
    
    // Data Dragon API URL for Vietnamese champion data
    const dataUrl = 'https://ddragon.leagueoflegends.com/cdn/15.9.1/data/vi_VN/champion.json'
    
    try {
      const response = await fetch(dataUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'force-cache', // Cache the response
      })

      if (!response.ok) {
        throw new Error(`Error fetching champions data: ${response.status}`)
      }

      const data = await response.json()
      
      // Transform the data from object format to array format for easier handling
      const champions: Champion[] = Object.values(data.data as Record<string, Champion>)
      
      // Filter champions if search query is provided
      const filteredChampions = searchQuery 
        ? champions.filter(champion => 
            champion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            champion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            champion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        : champions
      
      // Sort champions alphabetically by name
      filteredChampions.sort((a, b) => a.name.localeCompare(b.name))
      
      // Paginate champions
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedChampions = filteredChampions.slice(startIndex, endIndex)
      
      // Return formatted response
      return NextResponse.json({
        data: {
          champions: paginatedChampions
        },
        total: filteredChampions.length,
        page,
        limit,
        totalPages: Math.ceil(filteredChampions.length / limit)
      })
    } catch (error) {
      console.error('Error fetching champions data:', error)
      return NextResponse.json(
        { message: `Error fetching champions data: ${error}` },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { message: `Error fetching champions: ${error}` },
      { status: 500 }
    )
  }
} 