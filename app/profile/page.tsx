"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  User, Shield, Mail, Calendar, LogOut, 
  Edit, ChevronRight, Clock, Award, Gamepad2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type UserInfo = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  avatarUrl?: string;
}

export default function ProfilePage() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập chưa
    const token = localStorage.getItem('accessToken')
    const storedUserInfo = localStorage.getItem('userInfo')
    
    if (!token) {
      // Nếu chưa đăng nhập, chuyển về trang login
      router.push('/login')
      return
    }
    
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo)
        setUserInfo(parsedUserInfo)
      } catch (e) {
        console.error('Lỗi khi parse thông tin user:', e)
      }
    }
    
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userInfo')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Đang tải...</h2>
            <p className="text-gray-400">Vui lòng đợi trong giây lát</p>
          </div>
        </div>
      </div>
    )
  }

  if (!userInfo) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-500/20 border border-red-500 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy thông tin</h2>
          <p className="text-gray-300 mb-4">
            Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.
          </p>
          <Link 
            href="/login"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Fake stats (demo only)
  const userStats = {
    matchesPlayed: 423,
    winRate: 63,
    favChampion: "Yasuo",
    rankPoints: 1850,
    rank: "Bạch Kim",
    lastPlayed: "2023-11-18"
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Hồ Sơ Người Dùng</h1>
      <p className="text-gray-400 mb-8">Quản lý thông tin và hoạt động của bạn</p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-[#121214] border-[#2a2a30]">
            <CardHeader className="pb-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={userInfo.avatarUrl || ""} />
                  <AvatarFallback className="bg-blue-600 text-xl">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{userInfo.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  {userInfo.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">{userInfo.email}</span>
                </div>
                {userInfo.createdAt && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">Tham gia: {formatDate(userInfo.createdAt)}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">ID: {userInfo.id}</span>
                </div>
                
                <div className="pt-4 space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between border-[#2a2a30] hover:bg-[#1a1a1c]"
                  >
                    <div className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      <span>Chỉnh sửa hồ sơ</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Đăng xuất</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="bg-[#1a1a1c] border border-[#2a2a30] p-1 mb-6">
              <TabsTrigger 
                value="stats" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Thống kê
              </TabsTrigger>
              <TabsTrigger 
                value="matches" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Lịch sử trận đấu
              </TabsTrigger>
              <TabsTrigger 
                value="champions" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Tướng yêu thích
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Cài đặt
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="stats">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#121214] border-[#2a2a30]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gamepad2 className="h-5 w-5 text-blue-400" />
                      <span>Số liệu trận đấu</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Số trận đã chơi</span>
                        <span className="font-bold">{userStats.matchesPlayed}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Tỉ lệ thắng</span>
                        <span className="font-bold text-green-500">{userStats.winRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Tướng chơi nhiều nhất</span>
                        <span className="font-bold">{userStats.favChampion}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Trận đấu gần nhất</span>
                        <span className="font-medium">{formatDate(userStats.lastPlayed)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#121214] border-[#2a2a30]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      <span>Xếp hạng</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Hạng hiện tại</span>
                        <span className="font-bold text-blue-400">{userStats.rank}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Điểm LP</span>
                        <span className="font-bold">{userStats.rankPoints}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Thành tựu</span>
                        <span className="font-medium">12 huy chương</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Bậc thành thạo</span>
                        <span className="font-medium">Cấp 245</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-[#121214] border-[#2a2a30] mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-400" />
                    <span>Hoạt động gần đây</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-400 text-center py-8">Chưa có hoạt động nào gần đây</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="matches">
              <Card className="bg-[#121214] border-[#2a2a30]">
                <CardHeader>
                  <CardTitle>Lịch sử trận đấu</CardTitle>
                  <CardDescription>
                    Xem lại các trận đấu gần đây của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-400 text-center py-8">Chưa có trận đấu nào gần đây</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="champions">
              <Card className="bg-[#121214] border-[#2a2a30]">
                <CardHeader>
                  <CardTitle>Tướng yêu thích</CardTitle>
                  <CardDescription>
                    Các tướng bạn sử dụng nhiều nhất
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-400 text-center py-8">Chưa có dữ liệu về tướng yêu thích</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card className="bg-[#121214] border-[#2a2a30]">
                <CardHeader>
                  <CardTitle>Cài đặt tài khoản</CardTitle>
                  <CardDescription>
                    Quản lý cài đặt tài khoản của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-400 text-center py-8">Chức năng cài đặt đang được phát triển</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 