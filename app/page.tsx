import Image from 'next/image'
import Link from 'next/link'
import FeaturedGuides from '@/components/home/featured-guides'
import ChampionSpotlight from '@/components/home/champion-spotlight'
import GuidesList from '@/components/home/guides-list'
import TierList from '@/components/home/tier-list'
import CommunitySection from '@/components/home/community-section'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-900/80 to-purple-900/80 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg" 
            alt="League of Legends Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Find The Best League of Legends Guides
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              Learn from the pros and climb the ranks with champion builds, strategies, and tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/champions" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors inline-block text-center">
                Browse Champions
              </Link>
              <Link href="/guides" className="bg-transparent hover:bg-white/10 border border-white text-white font-bold py-3 px-6 rounded-md transition-colors inline-block text-center">
                View Latest Guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Featured Guides Section */}
        <FeaturedGuides />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2">
            {/* Champion Spotlight */}
            <ChampionSpotlight />
            
            {/* Guides List */}
            <GuidesList />
          </div>
          
          <div className="space-y-8">
            {/* Tier List Section */}
            <TierList />
            
            {/* Community Section */}
            <CommunitySection />
          </div>
        </div>
      </div>
    </div>
  )
}