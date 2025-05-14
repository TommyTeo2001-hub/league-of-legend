import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { champion: string } }
) {
  try {
    const championId = params.champion;
    
    // 1. Fetch champion data
    const championResponse = await fetch(`https://ddragon.leagueoflegends.com/cdn/15.9.1/data/vi_VN/champion/${championId}.json`);
    
    if (!championResponse.ok) {
      throw new Error(`Failed to fetch champion data: ${championResponse.status}`);
    }
    
    const championData = await championResponse.json();
    const champion = championData.data[championId];
    
    // 2. Fetch items data
    const itemsResponse = await fetch('https://ddragon.leagueoflegends.com/cdn/15.9.1/data/vi_VN/item.json');
    
    if (!itemsResponse.ok) {
      throw new Error(`Failed to fetch items: ${itemsResponse.status}`);
    }
    
    const itemsData = await itemsResponse.json();
    const items = itemsData.data;
    
    // 3. Analyze champion to determine build type
    const buildType = analyzeChampion(champion);
    
    // 4. Select recommended items based on build type
    const recommendations = getRecommendedItems(items, buildType);
    
    return NextResponse.json({
      champion: champion.name,
      buildType: buildType,
      recommendations
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate item recommendations' },
      { status: 500 }
    );
  }
}

// Function to analyze champion and determine build type
function analyzeChampion(champion: any) {
  // Get champion tags and stats
  const tags = champion.tags || [];
  const primaryRole = tags[0]?.toLowerCase() || '';
  
  // Calculate stats importance
  const attackImportance = champion.info?.attack || 0;
  const defenseImportance = champion.info?.defense || 0;
  const magicImportance = champion.info?.magic || 0;
  
  // Analyze abilities to determine damage type and playstyle
  const abilities = champion.spells || [];
  const abilityTexts = abilities.map((spell: any) => 
    (spell.description + ' ' + spell.tooltip).toLowerCase()
  );
  
  const hasMagicDamage = abilityTexts.some((text: string) => 
    text.includes('magic damage') || 
    text.includes('sát thương phép') || 
    text.includes('ap') ||
    text.includes('ability power')
  );
  
  const hasPhysicalDamage = abilityTexts.some((text: string) => 
    text.includes('physical damage') || 
    text.includes('sát thương vật lý') ||
    text.includes('ad') ||
    text.includes('attack damage')
  );
  
  const hasCrowdControl = abilityTexts.some((text: string) => 
    text.includes('stun') || 
    text.includes('slow') || 
    text.includes('root') || 
    text.includes('knock') ||
    text.includes('làm chậm') ||
    text.includes('choáng') ||
    text.includes('làm choáng') ||
    text.includes('giam cầm')
  );
  
  const isDurable = defenseImportance >= 5 || 
    primaryRole === 'tank' || 
    tags.includes('Fighter');
  
  // Determine build type based on analysis
  let buildType = '';
  
  if (hasMagicDamage && magicImportance >= 6) {
    buildType = 'AP';
  } else if (hasPhysicalDamage && attackImportance >= 6) {
    buildType = 'AD';
  } else if (isDurable) {
    buildType = 'Tank';
  } else if (primaryRole === 'support') {
    buildType = hasMagicDamage ? 'APSupport' : 'TankSupport';
  } else {
    // Default based on highest importance
    buildType = magicImportance > attackImportance ? 'AP' : 'AD';
  }
  
  if (primaryRole === 'marksman') {
    buildType = 'ADC';
  }
  
  return {
    buildType,
    primaryRole,
    hasCrowdControl,
    isDurable,
    attackImportance,
    magicImportance,
    defenseImportance
  };
}

// Function to get recommended items based on build type
function getRecommendedItems(items: any, buildInfo: any) {
  // Process and categorize all items
  const categorizedItems = {
    starters: [] as any[],
    boots: [] as any[],
    mythics: [] as any[],
    legendaries: [] as any[]
  };
  
  // Analyze each item and categorize it
  Object.entries(items).forEach(([itemId, itemData]: [string, any]) => {
    const item = itemData;
    
    // Skip consumables and trinkets
    if (item.gold.purchasable === false || 
        item.gold.total < 300 || 
        itemId === "2055" || // Control Ward
        item.tags.includes("Consumable") || 
        item.tags.includes("Trinket")) {
      return;
    }
    
    // Identify starter items (cheaper items typically bought at start)
    if (item.gold.total <= 500 && item.depth >= 2) {
      categorizedItems.starters.push({
        id: itemId,
        name: item.name,
        icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/${itemId}.png`,
        price: item.gold.total,
        description: item.plaintext || item.description,
        stats: item.stats,
        tags: item.tags
      });
    }
    
    // Identify boots
    else if (item.tags.includes("Boots") && item.depth >= 2) {
      categorizedItems.boots.push({
        id: itemId,
        name: item.name,
        icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/${itemId}.png`,
        price: item.gold.total,
        description: item.plaintext || item.description,
        stats: item.stats,
        tags: item.tags
      });
    }
    
    // Identify mythic items
    else if (item.description && 
            (item.description.includes("Mythic") || 
             item.description.includes("Huyền thoại"))) {
      categorizedItems.mythics.push({
        id: itemId,
        name: item.name,
        icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/${itemId}.png`,
        price: item.gold.total,
        description: item.plaintext || item.description,
        stats: item.stats,
        tags: item.tags
      });
    }
    
    // Identify legendary items (expensive completed items)
    else if (item.gold.total >= 2000 && !item.into && item.depth >= 3) {
      categorizedItems.legendaries.push({
        id: itemId,
        name: item.name,
        icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/${itemId}.png`,
        price: item.gold.total,
        description: item.plaintext || item.description,
        stats: item.stats,
        tags: item.tags
      });
    }
  });
  
  // Filter each category based on build type
  const filteredItems = filterItemsByBuildType(categorizedItems, buildInfo);
  
  // Build recommendation structure
  return {
    starters: filteredItems.starters.slice(0, 2),
    boots: filteredItems.boots.slice(0, 2),
    coreItems: [...filteredItems.mythics.slice(0, 1), ...filteredItems.legendaries.slice(0, 2)],
    luxuryItems: filteredItems.legendaries.slice(0, 3)
  };
}

// Function to filter items by build type
function filterItemsByBuildType(items: any, buildInfo: any) {
  const buildType = buildInfo.buildType;
  const filtered = { ...items };
  
  // Filter starter items
  filtered.starters = filtered.starters.filter(item => {
    if (buildType === 'AP') {
      return item.tags.includes('SpellDamage') || item.tags.includes('Mana');
    } else if (buildType === 'AD' || buildType === 'ADC') {
      return item.tags.includes('Damage') || item.tags.includes('AttackSpeed');
    } else if (buildType === 'Tank') {
      return item.tags.includes('Health') || item.tags.includes('Armor') || item.tags.includes('SpellBlock');
    } else if (buildType === 'APSupport' || buildType === 'TankSupport') {
      return item.tags.includes('GoldPer') || item.description.includes('support') || item.tags.includes('Vision');
    }
    return true;
  });
  
  // Filter boots
  filtered.boots = filtered.boots.filter(item => {
    if (buildType === 'AP' || buildType === 'APSupport') {
      // Mage boots - prioritize magic pen or CDR
      return item.description.includes('Magic Penetration') || item.description.includes('Ability Haste');
    } else if (buildType === 'ADC') {
      // ADC boots - prioritize attack speed
      return item.description.includes('Attack Speed') || item.name.includes('Berserker');
    } else if (buildType === 'Tank' || buildType === 'TankSupport') {
      // Tank boots - prioritize defensive stats
      return item.description.includes('Armor') || item.description.includes('Magic Resist') || item.description.includes('Tenacity');
    }
    return true;
  });
  
  // Filter mythic items
  filtered.mythics = filtered.mythics.filter(item => {
    if (buildType === 'AP') {
      return item.tags.includes('SpellDamage') || item.tags.includes('Mana');
    } else if (buildType === 'AD') {
      return item.tags.includes('Damage') && !item.tags.includes('CriticalStrike');
    } else if (buildType === 'ADC') {
      return item.tags.includes('Damage') && (item.tags.includes('CriticalStrike') || item.tags.includes('AttackSpeed'));
    } else if (buildType === 'Tank') {
      return item.tags.includes('Health') && (item.tags.includes('Armor') || item.tags.includes('SpellBlock'));
    } else if (buildType === 'APSupport') {
      return item.tags.includes('SpellDamage') && item.description.toLowerCase().includes('support');
    } else if (buildType === 'TankSupport') {
      return item.tags.includes('Health') && item.description.toLowerCase().includes('support');
    }
    return true;
  });
  
  // Filter legendary items
  filtered.legendaries = filtered.legendaries.filter(item => {
    if (buildType === 'AP') {
      return item.tags.includes('SpellDamage');
    } else if (buildType === 'AD') {
      return item.tags.includes('Damage') && !item.tags.includes('CriticalStrike');
    } else if (buildType === 'ADC') {
      return item.tags.includes('Damage') && (item.tags.includes('CriticalStrike') || item.tags.includes('AttackSpeed'));
    } else if (buildType === 'Tank') {
      return item.tags.includes('Health') || item.tags.includes('Armor') || item.tags.includes('SpellBlock');
    } else if (buildType === 'APSupport') {
      return (item.tags.includes('SpellDamage') || item.tags.includes('ManaRegen')) && 
             !item.description.includes('Mythic');
    } else if (buildType === 'TankSupport') {
      return (item.tags.includes('Health') || item.tags.includes('Armor') || item.tags.includes('SpellBlock')) && 
             !item.description.includes('Mythic');
    }
    return true;
  });
  
  // Sort each category for further refinement
  filtered.starters.sort((a: any, b: any) => b.price - a.price);
  filtered.boots.sort((a: any, b: any) => b.price - a.price);
  filtered.mythics.sort((a: any, b: any) => b.price - a.price);
  filtered.legendaries.sort((a: any, b: any) => b.price - a.price);
  
  return filtered;
} 