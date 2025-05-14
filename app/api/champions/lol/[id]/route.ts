import { NextRequest, NextResponse } from 'next/server'
import { Champion } from '../route'

// Extended interface to include champion details
export interface ChampionDetail extends Champion {
  spells: Array<{
    id: string;
    name: string;
    description: string;
    tooltip: string;
    maxrank: number;
    cooldown: number[];
    cost: number[];
    range: number[];
    image: {
      full: string;
      sprite: string;
      group: string;
      x: number;
      y: number;
      w: number;
      h: number;
    };
    resource: string;
  }>;
  passive: {
    name: string;
    description: string;
    image: {
      full: string;
      sprite: string;
      group: string;
      x: number;
      y: number;
      w: number;
      h: number;
    };
  };
  skins: Array<{
    id: string;
    num: number;
    name: string;
    chromas: boolean;
  }>;
  allytips: string[];
  enemytips: string[];
  lore: string;
  blurb: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Data Dragon API URL for Vietnamese champion data
    const baseUrl = 'https://ddragon.leagueoflegends.com/cdn/15.9.1/data/vi_VN'
    
    try {
      // First, try to fetch the specific champion data with detailed info
      const response = await fetch(`${baseUrl}/champion/${id}.json`, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'force-cache', // Cache the response
      })

      if (response.ok) {
        const data = await response.json()
        const championData = data.data[id]

        return NextResponse.json({
          data: championData
        })
      }

      // If specific champion endpoint fails, try getting it from the full champions list
      const allChampionsResponse = await fetch(`${baseUrl}/champion.json`, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'force-cache',
      })

      if (!allChampionsResponse.ok) {
        throw new Error(`Error fetching champion data: ${allChampionsResponse.status}`)
      }

      const allChampionsData = await allChampionsResponse.json()
      const championData = allChampionsData.data[id]

      if (!championData) {
        return NextResponse.json(
          { message: `Champion with ID ${id} not found` },
          { status: 404 }
        )
      }

      return NextResponse.json({
        data: championData
      })
    } catch (error) {
      console.error('Error fetching champion data:', error)
      return NextResponse.json(
        { message: `Error fetching champion data: ${error}` },
        { status: 500 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { message: `Error fetching champion: ${error}` },
      { status: 500 }
    )
  }
} 