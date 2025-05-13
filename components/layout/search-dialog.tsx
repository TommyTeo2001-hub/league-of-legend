import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const searchData = {
  league: [
    { name: "Ahri", image: "https://images.pexels.com/photos/7915264/pexels-photo-7915264.jpeg", role: "Mid" },
    { name: "Yasuo", image: "https://images.pexels.com/photos/6498853/pexels-photo-6498853.jpeg", role: "Mid" },
    { name: "Lee Sin", image: "https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg", role: "Jungle" }
  ],
  wildrift: [
    { name: "Ahri", image: "https://images.pexels.com/photos/7915264/pexels-photo-7915264.jpeg", role: "Mid" },
    { name: "Yasuo", image: "https://images.pexels.com/photos/6498853/pexels-photo-6498853.jpeg", role: "Mid" },
    { name: "Lee Sin", image: "https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg", role: "Jungle" }
  ],
  tft: [
    { name: "Gnar", image: "https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg", traits: ["Freljord", "Shapeshifter"] },
    { name: "Lucian", image: "https://images.pexels.com/photos/7915264/pexels-photo-7915264.jpeg", traits: ["Gunner", "Sentinel"] }
  ]
}

type SearchDialogProps = {
  isOpen: boolean
  onClose: () => void
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleChampionClick = (game: string, name: string) => {
    const path = game === 'league' ? `/champions/${name.toLowerCase()}` :
                game === 'wildrift' ? `/wild-rift/champions/${name.toLowerCase()}` :
                `/tft/champions/${name.toLowerCase()}`
    router.push(path)
    onClose()
  }

  const filteredResults = {
    league: searchData.league.filter(champion => 
      champion.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    wildrift: searchData.wildrift.filter(champion => 
      champion.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    tft: searchData.tft.filter(champion => 
      champion.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const hasResults = Object.values(filteredResults).some(results => results.length > 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#121214] border-[#2a2a30] p-0">
        <div className="p-4 border-b border-[#2a2a30]">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search champions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1a1a1c] border-[#2a2a30] focus-visible:ring-blue-500 pl-10"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {hasResults ? (
            <div className="p-2">
              {/* League of Legends */}
              {filteredResults.league.length > 0 && (
                <div className="mb-4">
                  <div className="px-2 py-1.5 text-sm font-medium text-gray-400">League of Legends</div>
                  <div className="space-y-1">
                    {filteredResults.league.map((champion) => (
                      <button
                        key={champion.name}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a30] transition-colors text-left"
                        onClick={() => handleChampionClick('league', champion.name)}
                      >
                        <div className="relative w-10 h-10">
                          <Image
                            src={champion.image}
                            alt={champion.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{champion.name}</div>
                          <Badge variant="outline" className="text-xs bg-[#1a1a1c] border-[#2a2a30]">
                            {champion.role}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Wild Rift */}
              {filteredResults.wildrift.length > 0 && (
                <div className="mb-4">
                  <div className="px-2 py-1.5 text-sm font-medium text-gray-400">Wild Rift</div>
                  <div className="space-y-1">
                    {filteredResults.wildrift.map((champion) => (
                      <button
                        key={champion.name}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a30] transition-colors text-left"
                        onClick={() => handleChampionClick('wildrift', champion.name)}
                      >
                        <div className="relative w-10 h-10">
                          <Image
                            src={champion.image}
                            alt={champion.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{champion.name}</div>
                          <Badge variant="outline" className="text-xs bg-[#1a1a1c] border-[#2a2a30]">
                            {champion.role}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TFT */}
              {filteredResults.tft.length > 0 && (
                <div>
                  <div className="px-2 py-1.5 text-sm font-medium text-gray-400">Teamfight Tactics</div>
                  <div className="space-y-1">
                    {filteredResults.tft.map((champion) => (
                      <button
                        key={champion.name}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a30] transition-colors text-left"
                        onClick={() => handleChampionClick('tft', champion.name)}
                      >
                        <div className="relative w-10 h-10">
                          <Image
                            src={champion.image}
                            alt={champion.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{champion.name}</div>
                          <div className="flex gap-1">
                            {champion.traits.map((trait) => (
                              <Badge
                                key={trait}
                                variant="outline"
                                className="text-xs bg-[#1a1a1c] border-[#2a2a30]"
                              >
                                {trait}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              No champions found matching your search
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}