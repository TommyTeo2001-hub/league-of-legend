import { NextResponse } from 'next/server'
import newsData from '@/data/news.json'

const BE_LOL_API_URL = process.env.NEXT_PUBLIC_BE_LOL_API_URL

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!BE_LOL_API_URL) {
      throw new Error('BE_LOL_API_URL không được cấu hình')
    }
    
    // Gọi API từ BE-LOL để lấy tin tức theo ID
    const apiUrl = `${BE_LOL_API_URL}/api/news/${params.id}`
    console.log("Gọi API chi tiết tin tức từ:", apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Không tìm thấy bài viết' },
          { status: 404 }
        )
      }
      console.error(`API trả về lỗi: ${response.status} ${response.statusText}`)
      throw new Error(`Lỗi API: ${response.status}`)
    }
    
    // Parse response
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
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error(`Lỗi khi lấy tin tức ID ${params.id} từ BE-LOL API, sử dụng dữ liệu dự phòng:`, error)
    
    // Tìm kiếm bài viết trong dữ liệu local
    const article = newsData.articles.find(article => article.id === params.id)
    
    if (!article) {
      return NextResponse.json(
        { error: 'Không tìm thấy bài viết' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(article)
  }
} 