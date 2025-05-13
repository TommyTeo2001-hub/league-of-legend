import React from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Youtube, Twitch } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0c] border-t border-[#2a2a30] pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">MOBA<span className="text-orange-500">FIRE</span></h3>
            <p className="text-gray-400 text-sm mb-4">
              Find the best League of Legends guides for every champion. 
              Learn from the pros and climb the ranks.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitch className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold uppercase text-gray-300 mb-4">Game</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/champions" className="text-gray-400 hover:text-white transition-colors">Champions</Link></li>
              <li><Link href="/tier-list" className="text-gray-400 hover:text-white transition-colors">Tier List</Link></li>
              <li><Link href="/items" className="text-gray-400 hover:text-white transition-colors">Items</Link></li>
              <li><Link href="/runes" className="text-gray-400 hover:text-white transition-colors">Runes</Link></li>
              <li><Link href="/summoners" className="text-gray-400 hover:text-white transition-colors">Summoner Spells</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold uppercase text-gray-300 mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/guides" className="text-gray-400 hover:text-white transition-colors">Guides</Link></li>
              <li><Link href="/forum" className="text-gray-400 hover:text-white transition-colors">Forum</Link></li>
              <li><Link href="/streams" className="text-gray-400 hover:text-white transition-colors">Streams</Link></li>
              <li><Link href="/leaderboards" className="text-gray-400 hover:text-white transition-colors">Leaderboards</Link></li>
              <li><Link href="/premium" className="text-gray-400 hover:text-white transition-colors">Premium</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold uppercase text-gray-300 mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#2a2a30] mt-8 pt-6 text-center text-xs text-gray-500">
          <p>© 2025 Mobafire Clone. All rights reserved.</p>
          <p className="mt-2">
            This site is not affiliated with Riot Games. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer