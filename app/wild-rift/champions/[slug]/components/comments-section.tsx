"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageSquare, ThumbsUp, Flag, Loader2, Reply } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

type Comment = {
  _id: string;
  content: string;
  createdAt: string;
  authorName: string;
  likes: number;
  replies?: Comment[];
}

type CommentsResponse = {
  status: string;
  data: {
    comments: Comment[];
    total: number;
  }
}

type SectionProps = {
  championId?: string
}

export default function CommentsSection({ championId }: SectionProps) {
  const params = useParams()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalComments, setTotalComments] = useState(0)
  const commentRef = useRef<HTMLDivElement>(null)

  const slug = championId || params.slug

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
    
    // Tải comments từ API
    fetchComments(1)
  }, [slug])

  const fetchComments = async (pageNum = 1) => {
    if (!slug) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Sử dụng API chung cho comments với type=wildrift-champion và ID là slug của tướng
      const response = await fetch(`/api/comments?type=wildrift-champion&id=${slug}&page=${pageNum}&limit=10`)
      
      if (!response.ok) {
        throw new Error(`Không thể tải bình luận: ${response.status}`)
      }
      
      const data: CommentsResponse = await response.json()
      
      if (pageNum === 1) {
        setComments(data.data.comments)
      } else {
        setComments(prevComments => [...prevComments, ...data.data.comments])
      }
      
      setTotalComments(data.data.total)
      setHasMore(data.data.comments.length === 10)
      setPage(pageNum)
      
    } catch (err) {
      console.error('Lỗi khi tải bình luận:', err)
      setError('Không thể tải bình luận. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  const loadMoreComments = () => {
    if (!isLoading && hasMore) {
      fetchComments(page + 1)
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !slug) return

    setIsSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem('accessToken')
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: 'wildrift-champion',
          id: slug,
          authorName: isLoggedIn ? userName : 'Khách',
          content: newComment,
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Không thể đăng bình luận')
      }
      
      const data = await response.json()
      
      // Thêm comment mới vào danh sách
      setComments(prevComments => [data.data, ...prevComments])
      setNewComment('')
      
      // Cập nhật tổng số comments
      setTotalComments(prev => prev + 1)
      
      // Cuộn đến comment mới
      if (commentRef.current) {
        commentRef.current.scrollIntoView({ behavior: 'smooth' })
      }
      
      toast({
        title: "Bình luận thành công",
        description: "Bình luận của bạn đã được đăng",
        variant: "default",
      })
      
    } catch (err: any) {
      console.error('Lỗi khi đăng bình luận:', err)
      setError(err.message || 'Không thể đăng bình luận. Vui lòng thử lại sau.')
      toast({
        title: "Lỗi khi đăng bình luận",
        description: err.message || "Có vấn đề khi đăng bình luận của bạn",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        toast({
          title: "Yêu cầu đăng nhập",
          description: "Vui lòng đăng nhập để thích bình luận",
          variant: "destructive",
        })
        return
      }
      
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Không thể thích bình luận này')
      }
      
      // Cập nhật số lượt thích trong state
      setComments(comments => 
        comments.map(comment => {
          if (comment._id === commentId) {
            return { ...comment, likes: (comment.likes || 0) + 1 }
          }
          
          // Kiểm tra cả trong replies
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply._id === commentId
                  ? { ...reply, likes: (reply.likes || 0) + 1 }
                  : reply
              )
            }
          }
          
          return comment
        })
      )
      
    } catch (err) {
      console.error('Lỗi khi thích bình luận:', err)
      toast({
        title: "Lỗi",
        description: "Không thể thích bình luận này",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }
  
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500 text-white',
      'bg-green-500 text-white',
      'bg-purple-500 text-white',
      'bg-yellow-500 text-white',
      'bg-pink-500 text-white',
      'bg-indigo-500 text-white',
    ]
    
    // Simple hash function
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  return (
    <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8" ref={commentRef}>
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-blue-400" />
        <h2 className="text-2xl font-bold">Bình luận</h2>
      </div>

      {/* Comment Form */}
      <div className="mb-8">
        <Textarea
          placeholder="Chia sẻ suy nghĩ của bạn..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={isSubmitting}
          className="mb-4 bg-[#1a1a1c] border-[#2a2a30] focus-visible:ring-blue-500 min-h-[100px]"
        />
        <Button 
          onClick={handleSubmitComment}
          disabled={isSubmitting || !newComment.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang gửi...
            </>
          ) : (
            'Đăng bình luận'
          )}
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 && !isLoading ? (
          <div className="text-center py-10 text-gray-400">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="bg-[#1a1a1c]/60 rounded-lg p-5">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 border border-[#2a2a30]">
                  <AvatarFallback className={getAvatarColor(comment.authorName)}>
                    {getInitials(comment.authorName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{comment.authorName}</p>
                      <p className="text-xs text-gray-400">{formatDate(comment.createdAt)}</p>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Flag className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                  
                  <div className="mt-3 text-gray-300 whitespace-pre-wrap">
                    {comment.content}
                  </div>
                  
                  <div className="mt-4 flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1.5"
                      onClick={() => handleLikeComment(comment._id)}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {comment.likes && comment.likes > 0 ? comment.likes : 'Thích'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1.5"
                    >
                      <Reply className="h-3.5 w-3.5" />
                      Trả lời
                    </Button>
                  </div>
                  
                  {/* Nested replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-5 border-l border-[#2a2a30] space-y-4">
                      {comment.replies.map(reply => (
                        <div key={reply._id} className="pt-4">
                          <div className="flex gap-3">
                            <Avatar className="h-8 w-8 border border-[#2a2a30]">
                              <AvatarFallback className={getAvatarColor(reply.authorName)}>
                                {getInitials(reply.authorName)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-sm">{reply.authorName}</p>
                                  <p className="text-xs text-gray-400">{formatDate(reply.createdAt)}</p>
                                </div>
                              </div>
                              
                              <div className="mt-2 text-gray-300 text-sm whitespace-pre-wrap">
                                {reply.content}
                              </div>
                              
                              <div className="mt-3 flex items-center gap-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-xs gap-1.5"
                                  onClick={() => handleLikeComment(reply._id)}
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                  {reply.likes && reply.likes > 0 ? reply.likes : 'Thích'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        )}
        
        {/* Load more button */}
        {hasMore && comments.length > 0 && !isLoading && (
          <div className="flex justify-center mt-6">
            <Button 
              variant="outline" 
              onClick={loadMoreComments}
              className="bg-[#1a1a1c] border-[#2a2a30] hover:bg-[#25252c]"
            >
              Tải thêm bình luận
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}