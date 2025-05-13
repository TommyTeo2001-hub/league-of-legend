"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'

const gameTypes = ["All", "Ranked Solo/Duo", "Ranked Flex", "Normal", "ARAM"]
const roles = ["All", "Top", "Jungle", "Mid", "ADC", "Support"]
const champions = ["All", "Ahri", "Yasuo", "Lee Sin", "Lux", "Thresh"]
const results = ["All", "Victory", "Defeat"]

export default function MatchFilters() {
  const [selectedGameType, setSelectedGameType] = useState("All")
  const [selectedRole, setSelectedRole] = useState("All")
  const [selectedChampion, setSelectedChampion] = useState("All")
  const [selectedResult, setSelectedResult] = useState("All")

  return (
    <div className="space-y-6">
      {/* Game Type Filter */}
      <div>
        <h3 className="text-sm text-gray-400 mb-2">Game Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {gameTypes.map((type) => (
            <Button
              key={type}
              variant={selectedGameType === type ? "default" : "outline"}
              className={`text-xs justify-start px-3 ${
                selectedGameType === type
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-[#1a1a1c] hover:bg-[#2a2a30] border-[#2a2a30]"
              }`}
              onClick={() => setSelectedGameType(type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Role Filter */}
      <div>
        <h3 className="text-sm text-gray-400 mb-2">Role</h3>
        <div className="grid grid-cols-2 gap-2">
          {roles.map((role) => (
            <Button
              key={role}
              variant={selectedRole === role ? "default" : "outline"}
              className={`text-xs justify-start px-3 ${
                selectedRole === role
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-[#1a1a1c] hover:bg-[#2a2a30] border-[#2a2a30]"
              }`}
              onClick={() => setSelectedRole(role)}
            >
              {role}
            </Button>
          ))}
        </div>
      </div>

      {/* Champion Filter */}
      <div>
        <h3 className="text-sm text-gray-400 mb-2">Champion</h3>
        <div className="grid grid-cols-2 gap-2">
          {champions.map((champion) => (
            <Button
              key={champion}
              variant={selectedChampion === champion ? "default" : "outline"}
              className={`text-xs justify-start px-3 ${
                selectedChampion === champion
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-[#1a1a1c] hover:bg-[#2a2a30] border-[#2a2a30]"
              }`}
              onClick={() => setSelectedChampion(champion)}
            >
              {champion}
            </Button>
          ))}
        </div>
      </div>

      {/* Result Filter */}
      <div>
        <h3 className="text-sm text-gray-400 mb-2">Result</h3>
        <div className="grid grid-cols-2 gap-2">
          {results.map((result) => (
            <Button
              key={result}
              variant={selectedResult === result ? "default" : "outline"}
              className={`text-xs justify-start px-3 ${
                selectedResult === result
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-[#1a1a1c] hover:bg-[#2a2a30] border-[#2a2a30]"
              }`}
              onClick={() => setSelectedResult(result)}
            >
              {result}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}