import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

type RelatedChampionsProps = {
  champions: Array<{
    name: string
    image: string
    role: string
    difficulty: string
  }>
}

export default function RelatedChampions({ champions }: RelatedChampionsProps) {
  return (
    <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Similar Champions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {champions.map((champion) => (
          <Link
            key={champion.name}
            href={`/wild-rift/champions/${champion.name.toLowerCase()}`}
            className="bg-[#1a1a1c] rounded-lg overflow-hidden hover:border-blue-500 transition-colors group"
          >
            <div className="relative aspect-square">
              <Image
                src={champion.image}
                alt={champion.name}
                fill
                className="object-cover transition-transform group-hover:scale-110 duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121214] to-transparent" />
            </div>
            <div className="p-3">
              <h3 className="font-medium text-center mb-2">{champion.name}</h3>
              <div className="flex flex-wrap justify-center gap-1">
                <Badge variant="outline" className="text-[0.65rem] bg-[#121214] border-[#2a2a30]">
                  {champion.role}
                </Badge>
                <Badge variant="outline" className="text-[0.65rem] bg-[#121214] border-[#2a2a30]">
                  {champion.difficulty}
                </Badge>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}