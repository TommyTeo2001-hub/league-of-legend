import { NextResponse } from 'next/server'
import newsData from '@/data/news.json'

const BE_LOL_API_URL = process.env.NEXT_PUBLIC_BE_LOL_API_URL

// Định nghĩa kiểu dữ liệu cho các đối tượng news
interface NewsItem {
  _id?: string;
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string | {
    name: string;
    image?: string;
  };
  date: string;
  readTime?: string;
  __v?: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'
    
    if (!BE_LOL_API_URL) {
      throw new Error('BE_LOL_API_URL không được cấu hình')
    }
    
    const apiUrl = `${BE_LOL_API_URL}/api/news?page=${page}&limit=${limit}`
    console.log("Gọi API news từ:", apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    
    if (!response.ok) {
      console.error(`API trả về lỗi: ${response.status} ${response.statusText}`)
      throw new Error(`Lỗi API: ${response.status}`)
    }
    
    const responseText = await response.text()
    console.log('Response mẫu:', responseText.substring(0, 100) + '...')
    
    let result
    try {
      result = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Lỗi parse JSON:', parseError)
      console.error('Response không hợp lệ:', responseText.substring(0, 200) + '...')
      throw new Error('Response không phải JSON hợp lệ')
    }
    
    if (!result.data || !Array.isArray(result.data)) {
      console.error('Cấu trúc API response không đúng:', result)
      throw new Error('Cấu trúc API response không đúng')
    }
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Lỗi khi lấy news từ BE-LOL API, sử dụng dữ liệu dự phòng:', error)
    
    const pageNum = parseInt(new URL(request.url).searchParams.get('page') || '1', 10)
    const pageSize = parseInt(new URL(request.url).searchParams.get('limit') || '20', 10)
    const startIndex = (pageNum - 1) * pageSize
    const endIndex = startIndex + pageSize
    
    const totalNews = newsData.articles.length
    const paginatedNews = newsData.articles.slice(startIndex, endIndex)
    
    return NextResponse.json({
      data: paginatedNews,
      total: totalNews,
      page: pageNum,
      limit: pageSize,
      totalPages: Math.ceil(totalNews / pageSize)
    })
  }
}