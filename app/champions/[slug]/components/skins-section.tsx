"use client"

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Skin {
  name: string
  image: string
  price: number
  releaseDate: string
}

interface SkinsSectionProps {
  skins: Skin[]
  championName: string
}

export default function SkinsSection({ skins, championName }: SkinsSectionProps) {
  const [selectedSkin, setSelectedSkin] = useState(0)
  
  // If there are no skins or only the default skin, don't render the section
  if (!skins || skins.length <= 1) return null
  
  const handlePrevSkin = () => {
    setSelectedSkin((prev) => (prev === 0 ? skins.length - 1 : prev - 1))
  }
  
  const handleNextSkin = () => {
    setSelectedSkin((prev) => (prev === skins.length - 1 ? 0 : prev + 1))
  }
  
  return (
    <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Bộ Sưu Tập Trang Phục</h2>
      
      <div className="relative rounded-lg overflow-hidden mb-6">
        {/* Navigation buttons */}
        <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-black/50 border-none hover:bg-black/70"
            onClick={handlePrevSkin}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
        <div className="absolute right-0 top-1/2 z-10 -translate-y-1/2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-black/50 border-none hover:bg-black/70"
            onClick={handleNextSkin}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Main skin image */}
        <div className="aspect-[16/9] md:aspect-[21/9] relative">
          <Image
            src={skins[selectedSkin].image}
            alt={skins[selectedSkin].name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h3 className="text-2xl font-bold mb-2">{skins[selectedSkin].name}</h3>
            {skins[selectedSkin].price > 0 && (
              <div className="bg-yellow-600/80 text-white px-3 py-1 rounded inline-block">
                {skins[selectedSkin].price} RP
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Skin thumbnails */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {skins.map((skin, index) => (
          <button
            key={index}
            onClick={() => setSelectedSkin(index)}
            className={`relative aspect-square overflow-hidden rounded border-2 ${
              selectedSkin === index ? 'border-blue-500' : 'border-transparent'
            } transition-all`}
          >
            <Image
              src={skin.image}
              alt={skin.name}
              fill
              className="object-cover"
            />
            <div className={`absolute inset-0 bg-black ${
              selectedSkin === index ? 'opacity-0' : 'opacity-40'
            }`} />
          </button>
        ))}
      </div>
      
      {/* Skin counter */}
      <div className="text-sm text-gray-400 text-center mt-4">
        {selectedSkin + 1} / {skins.length}
      </div>
    </div>
  )
} 