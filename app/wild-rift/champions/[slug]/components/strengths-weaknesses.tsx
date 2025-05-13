import { Shield, Sword, ChevronRight } from 'lucide-react'

type StrengthsWeaknessesProps = {
  championName: string
  strengths: string[]
  weaknesses: string[]
}

export default function StrengthsWeaknesses({ championName, strengths, weaknesses }: StrengthsWeaknessesProps) {
  return (
    <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(#2a2a30_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-6">Champion Analysis: {championName}</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-[#1a1a1c]/60 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Sword className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-green-400">Strengths</h3>
            </div>
            <div className="space-y-3">
              {strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-2 text-gray-200 group">
                  <ChevronRight className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 transition-transform group-hover:translate-x-1" />
                  <p>{strength}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="bg-[#1a1a1c]/60 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-red-400">Weaknesses</h3>
            </div>
            <div className="space-y-3">
              {weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-start gap-2 text-gray-200 group">
                  <ChevronRight className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5 transition-transform group-hover:translate-x-1" />
                  <p>{weakness}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}