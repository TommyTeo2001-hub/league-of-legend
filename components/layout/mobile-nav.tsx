"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Bell, User, LogOut, UserCircle } from 'lucide-react'

type MobileNavProps = {
  onClose: () => void
}

const MobileNav: React.FC<MobileNavProps> = ({ onClose }) => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập chưa
    const token = localStorage.getItem('accessToken')
    const userInfo = localStorage.getItem('userInfo')
    
    if (token) {
      setIsLoggedIn(true)
      if (userInfo) {
        try {
          const parsedUserInfo = JSON.parse(userInfo)
          setUserName(parsedUserInfo.name || 'User')
        } catch (e) {
          console.error('Lỗi khi parse thông tin user:', e)
          setUserName('User')
        }
      }
    } else {
      setIsLoggedIn(false)
      setUserName('')
    }
  }, [])
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userInfo')
    setIsLoggedIn(false)
    setUserName('')
    router.push('/')
    onClose()
  }
  
  const goToProfile = () => {
    router.push('/profile')
    onClose()
  }

  return (
    <div className="md:hidden bg-[#121214] border-b border-[#2a2a30] py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-4">
          <Link 
            href="/champions" 
            className="text-gray-300 hover:text-white py-2 transition-colors"
            onClick={onClose}
          >
            Tướng
          </Link>
          <Link 
            href="/wild-rift/champions" 
            className="text-gray-300 hover:text-white py-2 transition-colors"
            onClick={onClose}
          >
            Wild Rift
          </Link>
          <Link 
            href="/tft/champions" 
            className="text-gray-300 hover:text-white py-2 transition-colors"
            onClick={onClose}
          >
            TFT
          </Link>
          <Link 
            href="/items" 
            className="text-gray-300 hover:text-white py-2 transition-colors"
            onClick={onClose}
          >
            Trang Bị
          </Link>
          <Link 
            href="/counters" 
            className="text-gray-300 hover:text-white py-2 transition-colors"
            onClick={onClose}
          >
            Khắc Chế
          </Link>
          <Link 
            href="/match-history" 
            className="text-gray-300 hover:text-white py-2 transition-colors"
            onClick={onClose}
          >
            Lịch Sử Đấu
          </Link>
          <Link 
            href="/most-picked" 
            className="text-gray-300 hover:text-white py-2 transition-colors"
            onClick={onClose}
          >
            Tướng Phổ Biến
          </Link>
          <Link 
            href="/pc-components" 
            className="text-gray-300 hover:text-white py-2 transition-colors"
            onClick={onClose}
          >
            Linh Kiện PC
          </Link>
          <Link 
            href="/news" 
            className="text-gray-300 hover:text-white py-2 transition-colors"
            onClick={onClose}
          >
            Tin Tức
          </Link>
          
          <div className="pt-4 border-t border-[#2a2a30]">
            {isLoggedIn ? (
              <div className="space-y-4">
                <div className="text-blue-400 font-medium px-2">{userName}</div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#1a1a1c]"
                  onClick={goToProfile}
                >
                  <UserCircle className="h-4 w-4 mr-2" />
                  <span>Hồ sơ</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-[#1a1a1c]"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Đăng xuất</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-[#1a1a1c]">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-[#1a1a1c]">
                    <User className="h-5 w-5" />
                  </Button>
                </div>
                
                <Link 
                  href="/login" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                  onClick={onClose}
                >
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNav