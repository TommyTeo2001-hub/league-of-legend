"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Lock, Mail, User, Key, AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// Định nghĩa schema kiểm tra đầu vào
const registerAdminSchema = z.object({
  name: z.string().min(3, 'Tên phải có ít nhất 3 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(6, 'Xác nhận mật khẩu phải có ít nhất 6 ký tự'),
  secretKey: z.string().min(1, 'Mã bảo mật không được để trống'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu và xác nhận mật khẩu không khớp',
  path: ['confirmPassword'],
})

// Kiểu dữ liệu form
type RegisterAdminFormValues = z.infer<typeof registerAdminSchema>

export default function RegisterAdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Kiểm tra quyền truy cập
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        
        if (!token) {
          setIsAuthorized(false)
          setIsCheckingAuth(false)
          return
        }
        
        // Kiểm tra xem người dùng có phải là admin không
        const response = await fetch(`${process.env.NEXT_PUBLIC_BE_LOL_API_URL}/api/auth/check-admin`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        
        if (response.ok) {
          setIsAuthorized(true)
        } else {
          setIsAuthorized(false)
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra quyền truy cập:', error)
        setIsAuthorized(false)
      } finally {
        setIsCheckingAuth(false)
      }
    }
    
    checkAuth()
  }, [])

  // Khởi tạo form với React Hook Form
  const form = useForm<RegisterAdminFormValues>({
    resolver: zodResolver(registerAdminSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      secretKey: '',
    },
  })

  // Hàm xử lý đăng ký admin
  async function onSubmit(data: RegisterAdminFormValues) {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Loại bỏ các trường không cần thiết
      const { confirmPassword, secretKey, ...registerData } = data

      const response = await fetch(`${process.env.NEXT_PUBLIC_BE_LOL_API_URL}/api/auth/register-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'X-Admin-Secret': secretKey,
        },
        body: JSON.stringify(registerData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Đăng ký admin thất bại')
      }

      // Hiển thị thông báo thành công
      setSuccess('Đăng ký admin thành công! Đang chuyển hướng...')
      
      // Chuyển hướng đến trang đăng nhập sau 2 giây
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: any) {
      console.error('Lỗi đăng ký admin:', error)
      setError(error.message || 'Đăng ký admin thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  // Hiển thị màn hình loading trong khi kiểm tra quyền
  if (isCheckingAuth) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    )
  }

  // Hiển thị thông báo không có quyền truy cập
  if (!isAuthorized) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md bg-[#121214] border border-[#2a2a30]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Truy cập bị từ chối</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Cảnh báo</AlertTitle>
              <AlertDescription>
                Bạn không có quyền truy cập vào trang này. Trang này chỉ dành cho quản trị viên.
              </AlertDescription>
            </Alert>
            <Button
              className="w-full"
              onClick={() => router.push('/login')}
            >
              Đăng nhập với tài khoản admin
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Hiển thị form đăng ký admin
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md bg-[#121214] border border-[#2a2a30]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Tạo tài khoản Admin</CardTitle>
          <CardDescription className="text-center">
            Đăng ký tài khoản admin mới cho hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-md mb-4 text-sm">
              {success}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="Nguyễn Văn A"
                          className="bg-[#1a1a1c] border-[#2a2a30] pl-10"
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="admin@example.com"
                          className="bg-[#1a1a1c] border-[#2a2a30] pl-10"
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="bg-[#1a1a1c] border-[#2a2a30] pl-10 pr-10"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="bg-[#1a1a1c] border-[#2a2a30] pl-10 pr-10"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-white"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secretKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã bảo mật Admin</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          {...field}
                          type="password"
                          placeholder="Nhập mã bảo mật admin"
                          className="bg-[#1a1a1c] border-[#2a2a30] pl-10"
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Tạo tài khoản Admin"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-400">
            <Link href="/" className="text-blue-500 hover:underline">
              Quay lại trang chủ
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 