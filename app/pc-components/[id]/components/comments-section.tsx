"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Mock data cho comments
const MOCK_COMMENTS = [
  {
    id: 1,
    author: {
      name: 'Alice Johnson',
      avatar: 'https://images.pexels.com/photos/7915264/pexels-photo-7915264.jpeg'
    },
    content: 'Thực sự rất thú vị khi NVIDIA tiếp tục đẩy giới hạn của GPU. Tôi tự hỏi liệu 4090 Super có đáng để nâng cấp từ 4090 thông thường hay không?',
    date: '2 giờ trước',
    likes: 8
  },
  {
    id: 2,
    author: {
      name: 'Bob Smith',
      avatar: 'https://images.pexels.com/photos/6498853/pexels-photo-6498853.jpeg'
    },
    content: 'Với TDP 600W, tôi thực sự lo lắng về việc tản nhiệt và nguồn điện. Có lẽ sẽ cần nguồn 1200W cho hệ thống này.',
    date: '5 giờ trước',
    likes: 12
  },
  {
    id: 3,
    author: {
      name: 'Carol Davis',
      avatar: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg'
    },
    content: 'Tôi vẫn đang chạy GTX 1080 và cảm thấy ổn với hầu hết các game. Những người tiêu dùng bình thường có thực sự cần sức mạnh như vậy không?',
    date: '1 ngày trước',
    likes: 5
  }
]

export default function CommentsSection() {
  const [comments, setComments] = useState(MOCK_COMMENTS)
  const [newComment, setNewComment] = useState('')

  const handleSubmitComment = () => {
    if (!newComment.trim()) return
    
    const comment = {
      id: comments.length + 1,
      author: {
        name: 'Bạn',
        avatar: 'https://images.pexels.com/photos/6498900/pexels-photo-6498900.jpeg'
      },
      content: newComment,
      date: 'Vừa xong',
      likes: 0
    }
    
    setComments([comment, ...comments])
    setNewComment('')
  }

  return (
    <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6">Bình luận ({comments.length})</h2>
      
      {/* Comment Form */}
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <Avatar>
            <AvatarImage src="https://images.pexels.com/photos/6498900/pexels-photo-6498900.jpeg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="Viết bình luận của bạn..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-[#1a1a1c] border-[#2a2a30] focus-visible:ring-blue-500 min-h-[100px]"
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmitComment}>Đăng bình luận</Button>
        </div>
      </div>
      
      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-t border-[#2a2a30] pt-6">
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src={comment.author.avatar} />
                <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-medium">{comment.author.name}</div>
                  <div className="text-sm text-gray-400">{comment.date}</div>
                </div>
                <p className="text-gray-300 mb-2">{comment.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <button className="hover:text-white transition-colors">Like ({comment.likes})</button>
                  <button className="hover:text-white transition-colors">Trả lời</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}