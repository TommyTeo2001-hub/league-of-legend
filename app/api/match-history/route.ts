import { NextRequest, NextResponse } from 'next/server'
import matchHistoryData from '@/data/match-history.json'

const BE_LOL_API_URL = process.env.NEXT_PUBLIC_BE_LOL_API_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gameName = searchParams.get('gameName')
    const tagLine = searchParams.get('tagLine')
    const count = searchParams.get('count') || '10'
    const region = searchParams.get('region') || 'europe'

    // Nếu không có gameName hoặc tagLine, trả về dữ liệu mẫu
    if (!gameName || !tagLine) {
      return NextResponse.json(matchHistoryData.matches)
    }

    console.log(`Fetching match history for ${gameName}#${tagLine} from BE-LOL API`)

    // Gọi API BE-LOL
    const response = await fetch(
      `${BE_LOL_API_URL}/matches/riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}?count=${count}&region=${region}`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error(`Error fetching match history: ${response.status}`)
    }

    const data = await response.json()
    
    // Biến đổi dữ liệu trả về để phù hợp với cấu trúc đã có
    const formattedMatches = data.data.map((match: any) => {
      // Tìm thông tin người chơi hiện tại trong trận đấu
      const puuid = match.metadata.participants.find((p: string) => 
        p === data.summoner.puuid
      )
      
      const participantIndex = match.metadata.participants.indexOf(puuid)
      const participant = match.info.participants[participantIndex]
      
      if (!participant) {
        return null
      }
      
      // Tính KDA
      const kills = participant.kills || 0
      const deaths = participant.deaths || 0
      const assists = participant.assists || 0
      const kdaRatio = deaths === 0 ? (kills + assists) : ((kills + assists) / deaths).toFixed(2)
      
      // Lấy thông tin trận đấu
      const gameCreation = new Date(match.info.gameStartTimestamp)
      const gameDuration = match.info.gameDuration
      const minutes = Math.floor(gameDuration / 60)
      const seconds = gameDuration % 60
      
      // Xác định kết quả trận đấu
      const win = participant.win
      
      // Lấy danh sách vật phẩm
      const items = []
      for (let i = 0; i <= 6; i++) {
        const itemId = participant[`item${i}`]
        if (itemId && itemId > 0) {
          items.push({
            id: itemId,
            image: `https://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${itemId}.png`
          })
        }
      }
      
      // Lấy danh sách đồng đội
      const teamId = participant.teamId
      const team = match.info.participants
        .filter((p: any) => p.teamId === teamId && p !== participant)
        .map((p: any) => ({
          name: p.summonerName,
          champion: p.championName,
          image: `https://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${p.championName}.png`
        }))
      
      // Định dạng timestamp
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - gameCreation.getTime())
      let timestamp = ''
      
      if (diffTime < 3600000) {
        // Dưới 1 giờ
        timestamp = `${Math.floor(diffTime / 60000)} minutes ago`
      } else if (diffTime < 86400000) {
        // Dưới 1 ngày
        timestamp = `${Math.floor(diffTime / 3600000)} hours ago`
      } else {
        // Nhiều ngày
        timestamp = `${Math.floor(diffTime / 86400000)} days ago`
      }
      
      return {
        id: match.info.gameId,
        champion: {
          name: participant.championName,
          image: `https://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${participant.championName}.png`
        },
        result: win ? 'Victory' : 'Defeat',
        kda: `${kills}/${deaths}/${assists}`,
        kdaRatio: parseFloat(kdaRatio),
        role: participant.teamPosition || participant.lane || 'Unknown',
        gameType: match.info.gameMode,
        duration: `${minutes}:${seconds.toString().padStart(2, '0')}`,
        timestamp: timestamp,
        items: items,
        team: team
      }
    }).filter(Boolean)
    
    return NextResponse.json(formattedMatches)
  } catch (error: any) {
    console.error('Error fetching match history:', error)
    
    // Trả về dữ liệu mẫu nếu có lỗi
    return NextResponse.json({
      status: 'error',
      message: error.message,
      fallback: matchHistoryData.matches
    }, { status: 500 })
  }
}