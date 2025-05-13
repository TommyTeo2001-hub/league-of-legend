"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const champions = [
  { id: 1, name: "Ahri", img: "https://images.pexels.com/photos/7915264/pexels-photo-7915264.jpeg", roles: ["Mage", "Assassin"], difficulty: "Moderate" },
  { id: 2, name: "Yasuo", img: "https://images.pexels.com/photos/6498853/pexels-photo-6498853.jpeg", roles: ["Fighter", "Assassin"], difficulty: "High" },
  { id: 3, name: "Lee Sin", img: "https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg", roles: ["Fighter", "Assassin"], difficulty: "High" },
  { id: 4, name: "Lux", img: "https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg", roles: ["Mage", "Support"], difficulty: "Low" },
  { id: 5, name: "Kai'Sa", img: "https://images.pexels.com/photos/7915264/pexels-photo-7915264.jpeg", roles: ["Marksman"], difficulty: "Moderate" },
  { id: 6, name: "Thresh", img: "https://images.pexels.com/photos/6498304/pexels-photo-6498304.jpeg", roles: ["Support", "Tank"], difficulty: "High" },
  { id: 7, name: "Malphite", img: "https://images.pexels.com/photos/6498900/pexels-photo-6498900.jpeg", roles: ["Tank", "Fighter"], difficulty: "Low" },
  { id: 8, name: "Syndra", img: "https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg", roles: ["Mage"], difficulty: "Moderate" },
  { id: 9, name: "Diana", img: "https://images.pexels.com/photos/5726807/pexels-photo-5726807.jpeg", roles: ["Fighter", "Mage"], difficulty: "Moderate" },
  { id: 10, name: "Zed", img: "https://images.pexels.com/photos/6498853/pexels-photo-6498853.jpeg", roles: ["Assassin"], difficulty: "High" },
  { id: 11, name: "Caitlyn", img: "https://images.pexels.com/photos/7915264/pexels-photo-7915264.jpeg", roles: ["Marksman"], difficulty: "Moderate" },
  { id: 12, name: "Blitzcrank", img: "https://images.pexels.com/photos/6498304/pexels-photo-6498304.jpeg", roles: ["Tank", "Support"], difficulty: "Low" },
]

export default function WildRiftChampionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')

  const roles = ["Assassin", "Fighter", "Mage", "Marksman", "Support", "Tank"]
  const difficulties = ["Low", "Moderate", "High"]

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role))
    } else {
      setSelectedRoles([...selectedRoles, role])
    }
  }

  const toggleDifficulty = (difficulty: string) => {
    if (selectedDifficulty === difficulty) {
      setSelectedDifficulty('')
    } else {
      setSelectedDifficulty(difficulty)
    }
  }

  const resetFilters = () => {
    setSelectedRoles([])
    setSelectedDifficulty('')
  }

  const filteredChampions = champions.filter(champion => {
    const matchesSearch = champion.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRoles = selectedRoles.length === 0 || 
      champion.roles.some(role => selectedRoles.includes(role))
    const matchesDifficulty = selectedDifficulty === '' || 
      champion.difficulty === selectedDifficulty
    
    return matchesSearch && matchesRoles && matchesDifficulty
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Wild Rift Champions</h1>
        <p className="text-gray-400">Browse all Wild Rift champions and find the perfect match for your playstyle.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-5 sticky top-20">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </h2>

            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-1.5 block">Search</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search champions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#1a1a1c] border-[#2a2a30] focus-visible:ring-blue-500"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm text-gray-400 mb-1.5">Champion Role</h3>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(role => (
                  <Button
                    key={role}
                    type="button"
                    variant={selectedRoles.includes(role) ? "default" : "outline"}
                    className={`text-xs justify-start px-3 ${
                      selectedRoles.includes(role)
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-[#1a1a1c] hover:bg-[#2a2a30] border-[#2a2a30]"
                    }`}
                    onClick={() => toggleRole(role)}
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm text-gray-400 mb-1.5">Difficulty</h3>
              <div className="grid grid-cols-3 gap-2">
                {difficulties.map(difficulty => (
                  <Button
                    key={difficulty}
                    type="button"
                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                    className={`text-xs justify-start px-3 ${
                      selectedDifficulty === difficulty
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-[#1a1a1c] hover:bg-[#2a2a30] border-[#2a2a30]"
                    }`}
                    onClick={() => toggleDifficulty(difficulty)}
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              onClick={resetFilters}
              className="w-full bg-[#1a1a1c] hover:bg-[#2a2a30] border-[#2a2a30]"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Champions Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredChampions.map(champion => (
              <Link 
                key={champion.id}
                href={`/wild-rift/champions/${champion.name.toLowerCase()}`}
                className="bg-[#121214] border border-[#2a2a30] rounded-lg overflow-hidden hover:border-blue-500 transition-colors group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={champion.img}
                    alt={champion.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121214] to-transparent" />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-center mb-1">{champion.name}</h3>
                  <div className="flex flex-wrap justify-center gap-1">
                    {champion.roles.map(role => (
                      <div key={role} className="text-[0.65rem] text-gray-400 px-1.5 py-0.5 bg-[#1a1a1c] rounded">
                        {role}
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredChampions.length === 0 && (
            <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center">
              <h3 className="text-xl font-medium mb-2">No champions found</h3>
              <p className="text-gray-400 mb-4">Try adjusting your search criteria or filters.</p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}