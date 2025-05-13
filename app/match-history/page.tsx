"use client"

import SearchSection from './components/search-section'
import MatchList from './components/match-list'

export default function MatchHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Match History</h1>
        <p className="text-gray-400">View and analyze your recent League of Legends matches</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <SearchSection />
          </div>
        </div>

        {/* Match List */}
        <div className="lg:col-span-3">
          <MatchList />
        </div>
      </div>
    </div>
  )
}