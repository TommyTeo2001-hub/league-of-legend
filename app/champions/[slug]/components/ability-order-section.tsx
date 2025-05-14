import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Trophy, ArrowUp, Info } from 'lucide-react'

type AbilityOrderData = {
  winRate: string
  pickRate: string
  order: {
    passive: {
      name: string
      icon: string
    }
    abilities: Array<{
      key: 'Q' | 'W' | 'E' | 'R'
      name: string
      icon: string
      levels: boolean[]
    }>
  }
}

type AbilityOrderSectionProps = {
  abilityOrders: AbilityOrderData[]
}

export default function AbilityOrderSection({ abilityOrders }: AbilityOrderSectionProps) {
  // Count consecutive levels for each ability to determine max order
  const getMaxOrder = (abilityOrders: AbilityOrderData[]) => {
    if (!abilityOrders.length) return [];
    
    const mainBuild = abilityOrders[0];
    const abilities = mainBuild.order.abilities;
    
    // Count true values for each ability
    const counts = abilities.map(ability => ability.levels.filter(l => l).length);
    
    // Sort abilities by count (descending) and map to their keys
    return [...abilities].map((ability, index) => ({
      key: ability.key,
      name: ability.name,
      count: counts[index]
    }))
    .sort((a, b) => b.count - a.count)
    .map(item => ({key: item.key, name: item.name, count: item.count}));
  };
  
  const maxOrder = getMaxOrder(abilityOrders);
  
  // Get explanations for ability priorities
  const getAbilityPriorityReasons = (key: string) => {
    // In a real application, these would come from API data or deeper analysis
    // For now, providing generic explanations based on spell type
    const reasons = {
      Q: [
        'Sát thương chính của tướng', 
        'Hồi chiêu thấp', 
        'Tốt cho giao tranh và farm'
      ],
      W: [
        'Hỗ trợ kỹ năng khác',
        'Hữu ích khi gank hoặc thoát thân',
        'Tỉ lệ sát thương/năng lượng tốt'
      ],
      E: [
        'Giúp di chuyển nhanh', 
        'Tăng sát thương tổng thể', 
        'Tốt cho giao tranh dài'
      ],
      R: [
        'Kỹ năng tối thượng - nâng khi có thể',
        'Sát thương cao khi combo',
        'Khả năng đẩy lane và giao tranh tổng tốt'
      ]
    }[key] || ['Cân bằng khả năng giao tranh', 'Tỉ lệ sát thương/năng lượng tốt'];
    
    // Return only a few reasons, not all of them
    return reasons.slice(0, 2);
  };
  
  return (
    <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">Thứ tự tăng kỹ năng</h2>

      <div className="space-y-8">
        {abilityOrders.map((build, index) => (
          <div key={index} className="bg-[#1a1a1c] rounded-xl p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <h3 className="font-bold">
                  {index === 0 ? 'Phổ biến nhất' : `Thứ tự ${index + 1}`}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-[#121214] border-[#2a2a30]">
                  Tỉ lệ thắng: {build.winRate}
                </Badge>
                <Badge variant="outline" className="bg-[#121214] border-[#2a2a30]">
                  Tỉ lệ chọn: {build.pickRate}
                </Badge>
              </div>
            </div>
            
            {/* Max order summary */}
            {maxOrder.length > 0 && (
              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-2">Thứ tự ưu tiên:</div>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  {maxOrder.map((item, i) => (
                    <div key={item.key} className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-3 py-1 rounded text-lg font-bold ${
                          i === 0 ? 'bg-blue-500/20 text-blue-400' : 
                          i === 1 ? 'bg-green-500/20 text-green-400' : 
                          i === 2 ? 'bg-orange-500/20 text-orange-400' : 
                          'bg-purple-500/20 text-purple-400'
                        }`}>{item.key}</span>
                        
                        <div className="text-sm">
                          <div className="font-medium line-clamp-1">{item.name}</div>
                          <div className="text-xs text-gray-400">{item.count} điểm</div>
                        </div>
                      </div>
                      
                      <div className="ml-8 text-xs text-gray-400 max-w-sm">
                        <ul className="list-disc pl-3 space-y-1">
                          {getAbilityPriorityReasons(item.key).map((reason, index) => (
                            <li key={index}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-3 flex gap-2 text-xs text-gray-300">
                  <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="mb-1">Thứ tự nâng kỹ năng được phân tích dựa trên dữ liệu từ API: chỉ số sát thương, hồi chiêu, và tỉ lệ tăng sức mạnh theo cấp độ.</p>
                    <p>Luôn nâng R khi có thể (cấp 6/11/16).</p>
                  </div>
                </div>
              </div>
            )}

            {/* Abilities Grid */}
            <div className="space-y-4">
              {/* Passive */}
              <div className="flex items-center gap-4 py-2 border-b border-[#2a2a30]">
                <div className="relative w-12 h-12">
                  <Image
                    src={build.order.passive.icon}
                    alt={build.order.passive.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-grow">
                  <div className="text-sm font-medium">{build.order.passive.name}</div>
                  <div className="text-sm text-gray-400">Nội tại</div>
                </div>
              </div>

              {/* Q W E R Abilities */}
              {build.order.abilities.map((ability) => (
                <div key={ability.key} className="flex items-center gap-4">
                  <div className="relative w-12 h-12">
                    <Image
                      src={ability.icon}
                      alt={ability.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold bg-[#121214] border border-[#2a2a30] rounded-md">
                      {ability.key}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium line-clamp-1">{ability.name}</div>
                      <div className="text-xs px-2 py-0.5 rounded bg-[#121214] text-gray-300">
                        {ability.levels.filter(Boolean).length} điểm
                      </div>
                    </div>
                    <div className="grid grid-cols-18 gap-1">
                      {ability.levels.map((isLeveled, i) => (
                        <div
                          key={i}
                          className={`relative ${isLeveled ? 'bg-blue-500' : 'bg-[#2a2a30]'} h-4 rounded-sm flex items-center justify-center`}
                        >
                          {isLeveled && (
                            <span className="absolute text-[0.6rem] font-bold text-white">{i+1}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}