import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const guides = [
  {
    id: 1,
    title: "Ultimate Kai'Sa ADC Guide",
    author: "VoidHunter",
    authorImg: "https://images.pexels.com/photos/7915264/pexels-photo-7915264.jpeg",
    championImg: "https://images.pexels.com/photos/7915264/pexels-photo-7915264.jpeg",
    championName: "Kai'Sa",
    rating: 4.8,
    votes: 256,
    timestamp: "2 days ago",
    role: "ADC",
  },
  {
    id: 2,
    title: "Season 14 Malphite Top Lane Guide",
    author: "RockSolid",
    authorImg: "https://images.pexels.com/photos/6498900/pexels-photo-6498900.jpeg",
    championImg: "https://images.pexels.com/photos/6498900/pexels-photo-6498900.jpeg",
    championName: "Malphite",
    rating: 4.6,
    votes: 185,
    timestamp: "1 week ago",
    role: "Top",
  },
  {
    id: 3,
    title: "Master Thresh Support Guide",
    author: "HookCity",
    authorImg: "https://images.pexels.com/photos/6498304/pexels-photo-6498304.jpeg",
    championImg: "https://images.pexels.com/photos/6498304/pexels-photo-6498304.jpeg",
    championName: "Thresh",
    rating: 4.9,
    votes: 312,
    timestamp: "3 days ago",
    role: "Support",
  },
  {
    id: 4,
    title: "Climbing With Diana Jungle",
    author: "MoonGlaive",
    authorImg: "https://images.pexels.com/photos/5726807/pexels-photo-5726807.jpeg",
    championImg: "https://images.pexels.com/photos/5726807/pexels-photo-5726807.jpeg",
    championName: "Diana",
    rating: 4.7,
    votes: 198,
    timestamp: "5 days ago",
    role: "Jungle",
  },
  {
    id: 5,
    title: "Syndra Mid Domination",
    author: "DarkSphere",
    authorImg: "https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg",
    championImg: "https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg",
    championName: "Syndra",
    rating: 4.8,
    votes: 224,
    timestamp: "1 day ago",
    role: "Mid",
  },
]

const GuideItem = ({ guide }: { guide: typeof guides[0] }) => {
  return (
    <div className="border-b border-[#2a2a30] py-4 last:border-0">
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={guide.championImg}
            alt={guide.championName}
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-300">{guide.championName}</span>
            <Badge variant="outline" className="text-xs bg-[#1a1a1c] border-[#2a2a30]">
              {guide.role}
            </Badge>
          </div>
          <Link href={`/guides/${guide.id}`} className="text-lg font-medium hover:text-blue-400 transition-colors line-clamp-1">
            {guide.title}
          </Link>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full overflow-hidden">
                <Image
                  src={guide.authorImg}
                  alt={guide.author}
                  width={20}
                  height={20}
                  className="object-cover"
                />
              </div>
              <span>{guide.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span>{guide.rating}</span>
            </div>
            <div>{guide.timestamp}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const GuidesList = () => {
  return (
    <section className="mt-8">
      <Tabs defaultValue="latest" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">League Guides</h2>
          <TabsList className="bg-[#1a1a1c] border border-[#2a2a30]">
            <TabsTrigger 
              value="latest"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Latest
            </TabsTrigger>
            <TabsTrigger 
              value="popular"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Popular
            </TabsTrigger>
            <TabsTrigger 
              value="featured"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Featured
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="latest" className="mt-0">
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-4">
            {guides.map((guide) => (
              <GuideItem key={guide.id} guide={guide} />
            ))}
            
            <div className="mt-4 text-center">
              <Link 
                href="/guides"
                className="inline-block text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                View All Guides
              </Link>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="popular" className="mt-0">
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-4">
            {[...guides].sort((a, b) => b.votes - a.votes).map((guide) => (
              <GuideItem key={guide.id} guide={guide} />
            ))}
            
            <div className="mt-4 text-center">
              <Link 
                href="/guides/popular"
                className="inline-block text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                View All Popular Guides
              </Link>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="featured" className="mt-0">
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-4">
            {guides.slice(0, 3).map((guide) => (
              <GuideItem key={guide.id} guide={guide} />
            ))}
            
            <div className="mt-4 text-center">
              <Link 
                href="/guides/featured"
                className="inline-block text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                View All Featured Guides
              </Link>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default GuidesList