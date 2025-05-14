"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { fetchPCBuildComments, createPCBuildComment, Comment } from '@/lib/api'

export default function CommentsSection() {
  const params = useParams()
  const pcComponentId = params.id as string
  
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [newComment, setNewComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true)
        const result = await fetchPCBuildComments(pcComponentId)
        setComments(result.data.comments || [])
      } catch (err) {
        console.error('Error loading comments:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadComments()
  }, [pcComponentId])

  console.log(comments)
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      
      if (diffHours < 1) {
        return 'Vừa xong'
      } else if (diffHours < 24) {
        return `${diffHours} giờ trước`
      } else {
        const diffDays = Math.floor(diffHours / 24)
        return `${diffDays} ngày trước`
      }
    } catch (e) {
      return 'Ngày không hợp lệ'
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !authorName.trim()) return
    
    try {
      setSubmitting(true)
      
      const result = await createPCBuildComment(pcComponentId, {
        content: newComment,
        authorName: authorName
      })

      // Add the new comment to the list
      setComments([result, ...comments])
      
      // Clear the form
      setNewComment('')
    } catch (err) {
      console.error('Error submitting comment:', err)
      alert('Không thể đăng bình luận. Vui lòng thử lại sau.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 flex justify-center items-center min-h-[200px]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
          <p className="text-gray-400">Đang tải bình luận...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Bình luận</h2>
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-center">
          <p className="text-gray-300 mb-2">Không thể tải bình luận. Vui lòng thử lại sau.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6">Bình luận ({comments.length})</h2>
      
      {/* Comment Form */}
      <div className="mb-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="author-name">Tên của bạn</Label>
          <Input
            id="author-name"
            placeholder="Nhập tên của bạn..."
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="bg-[#1a1a1c] border-[#2a2a30] focus-visible:ring-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="comment-content">Nội dung bình luận</Label>
          <Textarea
            id="comment-content"
            placeholder="Viết bình luận của bạn..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-[#1a1a1c] border-[#2a2a30] focus-visible:ring-blue-500 min-h-[100px]"
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmitComment} 
            disabled={submitting || !newComment.trim() || !authorName.trim()}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi...
              </>
            ) : 'Đăng bình luận'}
          </Button>
        </div>
      </div>
      
      {/* No Comments */}
      {comments.length === 0 && (
        <div className="text-center py-8 border-t border-[#2a2a30]">
          <p className="text-gray-400">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
        </div>
      )}
      
      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="border-t border-[#2a2a30] pt-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback>{comment.authorName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-medium">{comment.authorName}</div>
                    <div className="text-sm text-gray-400">{formatDate(comment.createdAt)}</div>
                  </div>
                  <p className="text-gray-300 mb-2">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}