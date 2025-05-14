import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch item data from Data Dragon API
    const response = await fetch('https://ddragon.leagueoflegends.com/cdn/15.9.1/data/vi_VN/item.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.status}`);
    }
    
    const itemsData = await response.json();
    
    // Process items data from Data Dragon API
    const processedItems = Object.entries(itemsData.data)
      .filter(([itemId, item]: [string, any]) => {
        // Filter out template items and duplicates
        return (
          item.name && 
          item.gold && 
          item.gold.total && 
          !item.requiredChampion && 
          !item.hideFromAll && 
          item.inStore !== false
        );
      })
      .map(([itemId, item]: [string, any]) => {
        // Map item categories based on tags
        let category = 'Khác';
        if (item.tags.includes('Boots')) {
          category = 'Giày';
        } else if (item.tags.includes('Damage') || item.tags.includes('CriticalStrike') || item.tags.includes('AttackSpeed')) {
          category = 'Tấn công';
        } else if (item.tags.includes('SpellDamage') || item.tags.includes('Mana') || item.tags.includes('ManaRegen') || item.tags.includes('CooldownReduction')) {
          category = 'Phép thuật';
        } else if (item.tags.includes('Health') || item.tags.includes('Armor') || item.tags.includes('SpellBlock') || item.tags.includes('HealthRegen')) {
          category = 'Phòng thủ';
        }
        
        // Format stats text from stats object
        let statsText = '';
        if (item.stats) {
          // Process each statistic and format it
          const statMappings: Record<string, string> = {
            'FlatHPPoolMod': '+{value} Máu',
            'FlatMPPoolMod': '+{value} Năng Lượng',
            'PercentHPPoolMod': '+{value}% Máu',
            'FlatHPRegenMod': '+{value} Hồi Máu',
            'FlatArmorMod': '+{value} Giáp',
            'FlatPhysicalDamageMod': '+{value} Sát Thương',
            'FlatMagicDamageMod': '+{value} Sức Mạnh Phép Thuật',
            'FlatMovementSpeedMod': '+{value} Tốc Độ Di Chuyển',
            'PercentMovementSpeedMod': '+{value}% Tốc Độ Di Chuyển',
            'FlatAttackSpeedMod': '+{value} Tốc Độ Đánh',
            'PercentAttackSpeedMod': '+{value}% Tốc Độ Đánh',
            'FlatCritChanceMod': '+{value}% Tỉ Lệ Chí Mạng',
            'FlatSpellBlockMod': '+{value} Kháng Phép',
            'PercentLifeStealMod': '+{value}% Hút Máu',
            'PercentSpellVampMod': '+{value}% Hút Máu Phép'
          };
          
          const stats = [];
          for (const [statKey, value] of Object.entries(item.stats)) {
            if (value && value !== 0) {
              if (statMappings[statKey]) {
                const formattedValue = statMappings[statKey].replace('{value}', String(value));
                stats.push(formattedValue);
              }
            }
          }
          statsText = stats.join(', ');
        }
        
        return {
          id: itemId,
          name: item.name,
          description: item.description,
          plaintext: item.plaintext,
          image: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/${itemId}.png`,
          price: item.gold.total,
          sellPrice: item.gold.sell,
          purchasable: item.gold.purchasable,
          stats: statsText || item.plaintext,
          tags: item.tags,
          category: category,
          from: item.from || [],
          into: item.into || [],
          depth: item.depth || 1,
          maps: item.maps
        };
      })
      .sort((a: any, b: any) => a.price - b.price); // Sort by price
    
    return NextResponse.json(processedItems);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Không thể tải dữ liệu items' },
      { status: 500 }
    );
  }
}