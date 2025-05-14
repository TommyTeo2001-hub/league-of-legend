"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { fetchChampionsLol, ChampionsResponse, ChampionData } from '@/lib/api'

// Hàm helper để xác định độ khó của champion
function getDifficulty(champion: ChampionData): string {
  // Sử dụng thông tin difficulty từ Data Dragon API
  const difficultyLevel = champion.info?.difficulty || 0
  if (difficultyLevel >= 8) return 'Cao'
  if (difficultyLevel >= 5) return 'Trung bình'
  return 'Thấp'
}

export default function ChampionsPage() {
  const [championsData, setChampionsData] = useState<ChampionsResponse | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const loadChampions = async () => {
      try {
        setLoading(true)
        const res = await fetchChampionsLol(currentPage, 20, searchQuery)
        setChampionsData(res)
      } catch (error) {
        console.error('Không thể tải dữ liệu tướng:', error)
      } finally {
        setLoading(false)
      }
    }

    loadChampions()
  }, [currentPage, searchQuery])
  
  const roleMapping: Record<string, string> = {
    "Tank": "Đỡ đòn",
    "Fighter": "Đấu sĩ",
    "Assassin": "Sát thủ",
    "Mage": "Pháp sư",
    "Marksman": "Xạ thủ", 
    "Support": "Hỗ trợ"
  }

  const roles = ["Assassin", "Fighter", "Mage", "Marksman", "Support", "Tank"]
  const difficulties = ["Thấp", "Trung bình", "Cao"]

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role))
    } else {
      setSelectedRoles([...selectedRoles, role])
    }
  }

  const toggleDifficulty = (difficulty: string) => {
    if (selectedDifficulty === difficulty) {
      setSelectedDifficulty('')
    } else {
      setSelectedDifficulty(difficulty)
    }
  }

  const resetFilters = () => {
    setSelectedRoles([])
    setSelectedDifficulty('')
    setSearchQuery('')
  }

  const filteredChampions = championsData?.data?.champions?.filter((champion: ChampionData) => {
    const matchesSearch = searchQuery === '' || champion.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRoles = selectedRoles.length === 0 || 
      champion.tags.some(role => selectedRoles.includes(role))
    
    const championDifficulty = getDifficulty(champion)
    const matchesDifficulty = selectedDifficulty === '' || 
      championDifficulty === selectedDifficulty
    
    return matchesSearch && matchesRoles && matchesDifficulty
  }) || []

  const handlePrevPage = () => {
    if (championsData && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (championsData && currentPage < championsData.totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Function to get champion image URL
  const getChampionImageUrl = (champion: ChampionData) => {
    if (!champion || !champion.image) {
      return '/placeholder-champion.png'
    }
    
    // Using Data Dragon image format
    return `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${champion.image.full}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Danh sách tướng</h1>
        <p className="text-gray-400">Khám phá tất cả các tướng trong Liên Minh Huyền Thoại và tìm tướng phù hợp với lối chơi của bạn.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Thanh lọc */}
        <div className="lg:col-span-1">
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-5 sticky top-20">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Bộ lọc
            </h2>

            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-1.5 block">Tìm kiếm</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Tìm tướng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#1a1a1c] border-[#2a2a30] focus-visible:ring-blue-500"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm text-gray-400 mb-1.5">Vai trò tướng</h3>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(role => (
                  <Button
                    key={role}
                    type="button"
                    variant={selectedRoles.includes(role) ? "default" : "outline"}
                    className={`text-xs justify-start px-3 ${
                      selectedRoles.includes(role)
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-[#1a1a1c] hover:bg-[#2a2a30] border-[#2a2a30]"
                    }`}
                    onClick={() => toggleRole(role)}
                  >
                    {roleMapping[role] || role}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm text-gray-400 mb-1.5">Độ khó</h3>
              <div className="grid grid-cols-3 gap-2">
                {difficulties.map(difficulty => (
                  <Button
                    key={difficulty}
                    type="button"
                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                    className={`text-xs justify-start px-3 ${
                      selectedDifficulty === difficulty
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-[#1a1a1c] hover:bg-[#2a2a30] border-[#2a2a30]"
                    }`}
                    onClick={() => toggleDifficulty(difficulty)}
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              onClick={resetFilters}
              className="w-full bg-[#1a1a1c] hover:bg-[#2a2a30] border-[#2a2a30]"
            >
              Đặt lại bộ lọc
            </Button>
          </div>
        </div>

        {/* Lưới tướng */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredChampions.map(champion => (
              <Link 
                key={champion.id}
                href={`/champions/${champion.id}`}
                className="bg-[#121214] border border-[#2a2a30] rounded-lg overflow-hidden hover:border-blue-500 transition-colors group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={getChampionImageUrl(champion)}
                    alt={champion.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121214] to-transparent" />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-center mb-1">{champion.name}</h3>
                  <div className="flex flex-wrap justify-center gap-1">
                    {champion.tags?.map(role => (
                      <div key={role} className="text-[0.65rem] text-gray-400 px-1.5 py-0.5 bg-[#1a1a1c] rounded">
                        {roleMapping[role] || role}
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredChampions.length === 0 && !loading && (
            <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center">
              <h3 className="text-xl font-medium mb-2">Không tìm thấy tướng nào</h3>
              <p className="text-gray-400 mb-4">Hãy điều chỉnh lại tiêu chí tìm kiếm hoặc bộ lọc.</p>
              <Button onClick={resetFilters}>Đặt lại bộ lọc</Button>
            </div>
          )}

          {loading && (
            <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center">
              <h3 className="text-xl font-medium mb-2">Đang tải...</h3>
              <p className="text-gray-400">Vui lòng đợi trong giây lát</p>
            </div>
          )}

          {/* Phân trang */}
          {championsData && !loading && (
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Hiển thị {filteredChampions.length} / {championsData.total} tướng
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="bg-[#1a1a1c] hover:bg-[#2a2a30] border-[#2a2a30]"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                
                <div className="text-sm px-3 py-1 bg-[#1a1a1c] rounded-md">
                  Trang {currentPage} / {championsData.totalPages}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= championsData.totalPages}
                  className="bg-[#1a1a1c] hover:bg-[#2a2a30] border-[#2a2a30]"
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}