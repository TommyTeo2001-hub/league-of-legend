import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageSquare, ThumbsUp, Flag } from 'lucide-react'

type Comment = {
  id: number
  content: string
  created_at: string
  user: {
    name: string
    avatar_url: string
  }
  likes: number
  replies?: Comment[]
}

const demoComments: Comment[] = [
  {
    id: 1,
    content: "This champion is really strong in the current meta. The burst damage potential is insane if you can land your combo correctly.",
    created_at: "2024-03-20T10:30:00Z",
    user: {
      name: "ProPlayer123",
      avatar_url: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg"
    },
    likes: 42,
    replies: [
      {
        id: 2,
        content: "Agreed! The recent buffs to the ultimate really made a difference.",
        created_at: "2024-03-20T11:15:00Z",
        user: {
          name: "GameMaster",
          avatar_url: "https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg"
        },
        likes: 15
      }
    ]
  },
  {
    id: 3,
    content: "Here's a pro tip: Try to save your flash for defensive plays rather than engaging. This champion has enough mobility in their kit already.",
    created_at: "2024-03-20T12:00:00Z",
    user: {
      name: "WildRiftCoach",
      avatar_url: "https://images.pexels.com/photos/6498853/pexels-photo-6498853.jpeg"
    },
    likes: 28
  }
]

export default function CommentsSection() {
  const [comments, setComments] = useState(demoComments)
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsLoading(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const newCommentObj: Comment = {
      id: Math.max(...comments.map(c => c.id)) + 1,
      content: newComment,
      created_at: new Date().toISOString(),
      user: {
        name: "Guest User",
        avatar_url: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg"
      },
      likes: 0
    }

    setComments([newCommentObj, ...comments])
    setNewComment('')
    setIsLoading(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-blue-400" />
        <h2 className="text-2xl font-bold">Comments</h2>
      </div>

      {/* Comment Form */}
      <div className="mb-8">
        <Textarea
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-4 bg-[#1a1a1c] border-[#2a2a30] focus-visible:ring-blue-500 min-h-[100px]"
        />
        <Button 
          onClick={handleSubmitComment}
          disabled={isLoading || !newComment.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Post Comment
        </Button>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-4">
            {/* Main Comment */}
            <div className="bg-[#1a1a1c] rounded-lg p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.user.avatar_url} />
                  <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">{comment.user.name}</div>
                      <div className="text-sm text-gray-400">{formatDate(comment.created_at)}</div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-300">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-gray-200 mb-3">{comment.content}</p>
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{comment.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-12 space-y-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="bg-[#1a1a1c] rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={reply.user.avatar_url} />
                        <AvatarFallback>{reply.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium">{reply.user.name}</div>
                            <div className="text-sm text-gray-400">{formatDate(reply.created_at)}</div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-300">
                            <Flag className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-gray-200 mb-3">{reply.content}</p>
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 gap-2">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{reply.likes}</span>
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
      </div>
    </div>
  )
}