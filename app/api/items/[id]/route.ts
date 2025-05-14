import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  
  try {
    // Fetch item data from Data Dragon API
    const response = await fetch('https://ddragon.leagueoflegends.com/cdn/15.9.1/data/vi_VN/item.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.status}`);
    }
    
    const itemsData = await response.json();
    const allItems = itemsData.data;
    
    // Get the requested item
    const item = allItems[id];
    
    if (!item) {
      return NextResponse.json(
        { error: `Item với id ${id} không tồn tại` },
        { status: 404 }
      );
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
    
    // Get build path (items this item is built from)
    const buildPath = item.from ? item.from.map((fromId: string) => {
      const fromItem = allItems[fromId];
      return {
        id: fromId,
        name: fromItem ? fromItem.name : 'Unknown Item',
        image: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/${fromId}.png`,
        price: fromItem && fromItem.gold ? fromItem.gold.total : 0
      };
    }) : [];
    
    // Get items this item builds into
    const buildsInto = item.into ? item.into.map((intoId: string) => {
      const intoItem = allItems[intoId];
      return {
        id: intoId,
        name: intoItem ? intoItem.name : 'Unknown Item',
        image: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/${intoId}.png`,
        price: intoItem && intoItem.gold ? intoItem.gold.total : 0
      };
    }) : [];
    
    // Generate some tips based on item stats and description
    const tips: string[] = [];
    if (item.description.includes('Chủ động')) {
      tips.push('Sử dụng hiệu quả khả năng chủ động của item này tại thời điểm quan trọng trong trận đấu.');
    }
    
    if (item.tags.includes('Damage')) {
      tips.push('Item này tăng sát thương, hiệu quả nhất khi bạn xây dựng thêm tỉ lệ chí mạng hoặc xuyên giáp.');
    } else if (item.tags.includes('SpellDamage')) {
      tips.push('Tăng sức mạnh phép thuật, phù hợp với các tướng pháp sư hoặc có tỉ lệ sát thương phép cao.');
    } else if (item.tags.includes('Armor') || item.tags.includes('Health')) {
      tips.push('Item phòng thủ này hiệu quả khi đối đầu với đội hình nhiều sát thương vật lý.');
    } else if (item.tags.includes('SpellBlock')) {
      tips.push('Kháng phép giúp bạn sống sót tốt hơn khi đối đầu với tướng sát thương phép.');
    }
    
    // Suggest champion types that work well with this item
    const recommendedFor: string[] = [];
    if (item.tags.includes('Damage') && item.tags.includes('CriticalStrike')) {
      recommendedFor.push('Các xạ thủ');
    } else if (item.tags.includes('SpellDamage') && item.tags.includes('ManaRegen')) {
      recommendedFor.push('Các pháp sư cần hồi năng lượng');
    } else if (item.tags.includes('Armor') && item.tags.includes('Health')) {
      recommendedFor.push('Các tướng đỡ đòn');
    }
    
    // Construct response object
    const itemDetail = {
      id,
      name: item.name,
      description: item.description,
      image: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/${id}.png`,
      price: item.gold.total,
      totalPrice: item.gold.total,
      sellPrice: item.gold.sell,
      stats: statsText || item.plaintext,
      category,
      buildPath,
      buildsInto,
      tags: item.tags,
      maps: item.maps,
      depth: item.depth || 1,
      tips,
      usage: recommendedFor,
      recommendedChampions: [] // Could be populated with champion recommendations if needed
    };
    
    return NextResponse.json(itemDetail);
  } catch (error) {
    console.error('Error fetching item details:', error);
    return NextResponse.json(
      { error: 'Không thể tải thông tin chi tiết của item' },
      { status: 500 }
    );
  }
} 