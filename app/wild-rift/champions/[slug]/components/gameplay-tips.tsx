import { ChevronRight } from 'lucide-react'

type GameplayTipsProps = {
  championName: string
  laning: string[]
  teamfighting: string[]
  strengths: string[]
  weaknesses: string[]
  relatedChampions: Array<{
    name: string
    image: string
  }>
}

export default function GameplayTips({ 
  championName,
  laning,
  teamfighting,
  strengths,
  weaknesses,
  relatedChampions
}: GameplayTipsProps) {
  return (
    <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">How to Play {championName}</h2>

      {/* Laning Phase */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">Laning Phase</h3>
        <div className="space-y-3">
          {laning.map((tip, index) => (
            <div key={index} className="flex items-start gap-2 text-gray-200">
              <ChevronRight className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Teamfighting */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">Teamfighting</h3>
        <div className="space-y-3">
          {teamfighting.map((tip, index) => (
            <div key={index} className="flex items-start gap-2 text-gray-200">
              <ChevronRight className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-green-400 mb-4">Strengths</h3>
          <div className="space-y-3">
            {strengths.map((strength, index) => (
              <div key={index} className="flex items-start gap-2 text-gray-200">
                <ChevronRight className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p>{strength}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-red-400 mb-4">Weaknesses</h3>
          <div className="space-y-3">
            {weaknesses.map((weakness, index) => (
              <div key={index} className="flex items-start gap-2 text-gray-200">
                <ChevronRight className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p>{weakness}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Champions */}
      <div>
        <h3 className="text-lg font-semibold text-purple-400 mb-4">Similar Champions</h3>
        <div className="flex flex-wrap gap-4">
          {relatedChampions.map((champion) => (
            <div key={champion.name} className="flex items-center gap-2 bg-[#1a1a1c] rounded-lg p-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <img src={champion.image} alt={champion.name} className="object-cover" />
              </div>
              <span className="text-sm">{champion.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}