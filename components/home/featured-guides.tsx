"use client"

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const featuredGuides = [
  {
    id: 1,
    title: "Ultimate Ahri Mid Guide: Season 14",
    author: "FoxMaster99",
    championName: "Ahri",
    championImg: "https://images.pexels.com/photos/7915264/pexels-photo-7915264.jpeg",
    rating: 4.9,
    votes: 342,
    views: "126K",
    background: "bg-gradient-to-r from-purple-900/90 to-pink-700/90",
  },
  {
    id: 2,
    title: "Yasuo Top Lane Domination Guide",
    author: "WindWalker",
    championName: "Yasuo",
    championImg: "https://images.pexels.com/photos/6498853/pexels-photo-6498853.jpeg",
    rating: 4.7,
    votes: 278,
    views: "98K",
    background: "bg-gradient-to-r from-blue-900/90 to-cyan-700/90",
  },
  {
    id: 3,
    title: "Jungle Difference: Lee Sin Carry Guide",
    author: "KickMaster",
    championName: "Lee Sin",
    championImg: "https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg",
    rating: 4.8,
    votes: 305,
    views: "112K",
    background: "bg-gradient-to-r from-red-900/90 to-orange-700/90",
  },
]

const FeaturedGuides = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredGuides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredGuides.length) % featuredGuides.length)
  }

  const guide = featuredGuides[currentSlide]

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Featured Guides</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={prevSlide}
            className="border-[#2a2a30] bg-[#1a1a1c] hover:bg-[#2a2a30] text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextSlide}
            className="border-[#2a2a30] bg-[#1a1a1c] hover:bg-[#2a2a30] text-gray-300"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-xl">
        <div className="absolute inset-0">
          <Image 
            src={guide.championImg}
            alt={guide.championName}
            fill
            className="object-cover"
          />
          <div className={`absolute inset-0 ${guide.background}`} />
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl w-full md:max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-600 text-xs font-medium px-2.5 py-1 rounded">FEATURED</div>
              <div className="text-sm text-gray-300">{guide.championName}</div>
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold mb-2">{guide.title}</h3>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-300 mb-4">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span>{guide.rating} ({guide.votes} votes)</span>
              </div>
              <div>By {guide.author}</div>
              <div>{guide.views} views</div>
            </div>
            
            <Link 
              href={`/guides/${guide.id}`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              View Guide
            </Link>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {featuredGuides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentSlide === index ? 'bg-white scale-125' : 'bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedGuides