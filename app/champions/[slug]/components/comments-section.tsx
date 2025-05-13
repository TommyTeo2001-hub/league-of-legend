import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageSquare, ThumbsUp, Flag, Reply, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

type Comment = {
  _id: string
  content: string
  createdAt: string
  authorName: string
  userId?: string
  replies?: Comment[]
  likes?: number
}

type CommentsResponse = {
  status: string
  data: {
    comments: Comment[]
    total: number
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
    fetchComments()
  }, [slug])

  const fetchComments = async (pageNum = 1) => {
    if (!slug) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Sử dụng API route đã được cập nhật để trỏ đến /news/:newsId
      const response = await fetch(`/api/comments/champion/${slug}?page=${pageNum}&limit=10`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments')
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
      console.error('Error fetching comments:', err)
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
          newsId: slug, // Sử dụng slug tướng làm newsId
          authorName: isLoggedIn ? userName : 'Khách',
          content: newComment,
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to post comment')
      }
      
      const data = await response.json()
      
      // Thêm comment mới vào danh sách
      setComments(prevComments => [data.data, ...prevComments])
      setNewComment('')
      
      // Cập nhật tổng số comments
      setTotalComments(prev => prev + 1)
      toast({
        title: "Bình luận thành công",
        description: "Bình luận của bạn đã được đăng",
      })
      
    } catch (err) {
      console.error('Error posting comment:', err)
      setError('Không thể đăng bình luận. Vui lòng thử lại sau.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const handleLikeComment = async (commentId: string) => {
    if (!isLoggedIn) {
      setError('Bạn cần đăng nhập để thích bình luận')
      return
    }
    
    try {
      const token = localStorage.getItem('accessToken')
      
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to like comment')
      }
      
      const data = await response.json()
      
      // Cập nhật comment trong danh sách với like mới
      setComments(prevComments => 
        prevComments.map(comment => 
          comment._id === commentId 
            ? { ...comment, likes: (comment.likes || 0) + 1 } 
            : comment
        )
      )
      
      toast({
        title: "Đã thích bình luận",
        variant: "default",
      })
      
    } catch (err) {
      console.error('Error liking comment:', err)
      setError('Không thể thích bình luận. Vui lòng thử lại sau.')
    }
  }

  return (
    <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8">
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
              Đang đăng...
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
        {isLoading && page === 1 ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ ý kiến!
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-400 mb-2">
              {totalComments} bình luận
            </div>
            
            {comments.map((comment) => (
              <div key={comment._id} className="space-y-4">
                {/* Main Comment */}
                <div className="bg-[#1a1a1c] rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://avatars.dicebear.com/api/adventurer/${comment.authorName}.svg`} />
                      <AvatarFallback>{comment.authorName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium">{comment.authorName}</div>
                          <div className="text-sm text-gray-400">{formatDate(comment.createdAt)}</div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-300">
                          <Flag className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-gray-200 mb-3">{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-blue-400 gap-2"
                          onClick={() => handleLikeComment(comment._id)}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>{comment.likes || 0}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 gap-2">
                          <Reply className="h-4 w-4" />
                          <span>Trả lời</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-12 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply._id} className="bg-[#1a1a1c] rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://avatars.dicebear.com/api/adventurer/${reply.authorName}.svg`} />
                            <AvatarFallback>{reply.authorName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-medium">{reply.authorName}</div>
                                <div className="text-sm text-gray-400">{formatDate(reply.createdAt)}</div>
                              </div>
                              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-300">
                                <Flag className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-gray-200 mb-3">{reply.content}</p>
                            <div className="flex items-center gap-4">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-gray-400 hover:text-blue-400 gap-2"
                                onClick={() => handleLikeComment(reply._id)}
                              >
                                <ThumbsUp className="h-4 w-4" />
                                <span>{reply.likes || 0}</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={loadMoreComments}
                  disabled={isLoading}
                  className="bg-transparent border-[#2a2a30] hover:bg-[#1a1a1c]"
                >
                  {isLoading && page > 1 ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    'Tải thêm bình luận'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 