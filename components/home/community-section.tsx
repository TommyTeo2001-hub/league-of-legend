import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MessageSquare, Users } from 'lucide-react'

const forumPosts = [
  {
    id: 1,
    title: "Best champion for climbing out of Silver?",
    author: "SilverStruggler",
    authorImg: "https://images.pexels.com/photos/6498853/pexels-photo-6498853.jpeg",
    replies: 24,
    views: 872,
    timestamp: "3 hours ago",
  },
  {
    id: 2,
    title: "Thoughts on the new jungle changes?",
    author: "JungleMain42",
    authorImg: "https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg",
    replies: 42,
    views: 1256,
    timestamp: "1 day ago",
  },
  {
    id: 3,
    title: "Ward placement guide for supports",
    author: "VisionControl",
    authorImg: "https://images.pexels.com/photos/6498304/pexels-photo-6498304.jpeg",
    replies: 15,
    views: 634,
    timestamp: "2 days ago",
  },
]

const CommunitySection = () => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Community</h2>
        <Link href="/community" className="text-sm text-blue-400 hover:text-blue-300">
          Community Hub
        </Link>
      </div>

      <div className="bg-[#121214] border border-[#2a2a30] rounded-xl overflow-hidden">
        <div className="p-4 bg-[#1a1a1c] border-b border-[#2a2a30] flex justify-between items-center">
          <h3 className="font-medium">Recent Discussions</h3>
          <Link 
            href="/community/forum"
            className="text-xs text-gray-300 hover:text-white flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Forums</span>
          </Link>
        </div>

        <div className="divide-y divide-[#2a2a30]">
          {forumPosts.map((post) => (
            <div key={post.id} className="p-4">
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={post.authorImg}
                    alt={post.author}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div>
                  <Link 
                    href={`/community/forum/post/${post.id}`}
                    className="font-medium hover:text-blue-400 transition-colors block mb-1"
                  >
                    {post.title}
                  </Link>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                    <span>by {post.author}</span>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{post.replies}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{post.views}</span>
                    </div>
                    <span>{post.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 text-center border-t border-[#2a2a30]">
          <Link
            href="/community/forum"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            View All Discussions
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CommunitySection