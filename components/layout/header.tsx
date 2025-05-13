"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Menu, X, User, Bell, LogOut, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MobileNav from './mobile-nav'
import SearchDialog from './search-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Header = () => {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập chưa khi component mount
    const checkLoginStatus = () => {
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
    }
    
    checkLoginStatus()
    
    // Thêm event listener để cập nhật trạng thái khi localStorage thay đổi
    const handleStorageChange = () => {
      checkLoginStatus()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleSearch = () => {
    setSearchOpen(!searchOpen)
  }
  
  const handleLogout = () => {
    // Xóa thông tin đăng nhập từ localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userInfo')
    
    // Cập nhật trạng thái
    setIsLoggedIn(false)
    setUserName('')
    
    // Chuyển hướng về trang chủ
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-[#121214] border-b border-[#2a2a30]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-blue-400">MOBA<span className="text-orange-500">FIRE</span></div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/champions" className="text-gray-300 hover:text-white transition-colors">
              Tướng
            </Link>
            <Link href="/wild-rift/champions" className="text-gray-300 hover:text-white transition-colors">
              Wild Rift
            </Link>
            <Link href="/tft/champions" className="text-gray-300 hover:text-white transition-colors">
              TFT
            </Link>
            <Link href="/items" className="text-gray-300 hover:text-white transition-colors">
              Trang Bị
            </Link>
            <Link href="/counters" className="text-gray-300 hover:text-white transition-colors">
              Khắc Chế
            </Link>
            <Link href="/match-history" className="text-gray-300 hover:text-white transition-colors">
              Lịch Sử Đấu
            </Link>
            <Link href="/most-picked" className="text-gray-300 hover:text-white transition-colors">
              Tướng Phổ Biến
            </Link>
            <Link href="/pc-components" className="text-gray-300 hover:text-white transition-colors">
              Linh Kiện PC
            </Link>
            <Link href="/news" className="text-gray-300 hover:text-white transition-colors">
              Tin Tức
            </Link>
          </nav>

          {/* Right Side - Auth & Search */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSearch}
              className="text-gray-300 hover:text-white hover:bg-[#1a1a1c]"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-[#1a1a1c]">
                <Bell className="h-5 w-5" />
              </Button>
              
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-[#1a1a1c] relative">
                      <User className="h-5 w-5" />
                      <span className="sr-only">Menu người dùng</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#121214] border border-[#2a2a30]">
                    <div className="px-3 py-2 text-sm font-medium text-blue-400">
                      {userName}
                    </div>
                    <DropdownMenuSeparator className="bg-[#2a2a30]" />
                    <DropdownMenuItem 
                      className="cursor-pointer flex items-center gap-2 text-gray-300 hover:text-white hover:bg-[#1a1a1c]"
                      onClick={() => router.push('/profile')}
                    >
                      <UserCircle className="h-4 w-4" />
                      <span>Hồ sơ</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-[#1a1a1c]"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Đăng nhập
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile buttons */}
            <div className="flex md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMobileMenu} 
                className="text-gray-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && <MobileNav onClose={toggleMobileMenu} />}

      {/* Search Dialog */}
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}

export default Header