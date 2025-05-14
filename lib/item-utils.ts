// Item recommendation utilities

// Interface for an item
export interface Item {
  id: string;
  name: string;
  icon: string;
  price?: number;
  description?: string;
  stats?: Record<string, any>;
  tags?: string[];
}

// Interface for build recommendations
export interface BuildRecommendations {
  starters: Item[];
  boots: Item[];
  coreItems: Item[];
  luxuryItems: Item[];
}

// Analyze champion to determine build type
export function determineBuildType(champion: any): string {
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
  
  // Determine build type based on analysis
  let buildType = '';
  
  if (hasMagicDamage && magicImportance >= 6) {
    buildType = 'AP';
  } else if (hasPhysicalDamage && attackImportance >= 6) {
    buildType = 'AD';
  } else if (defenseImportance >= 5) {
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
  
  return buildType;
}

// Get recommended items from the Data Dragon API based on champion data
export async function getRecommendedItems(championData: any): Promise<BuildRecommendations> {
  try {
    // Fetch items from Data Dragon API
    const itemsResponse = await fetch('https://ddragon.leagueoflegends.com/cdn/15.9.1/data/vi_VN/item.json');
    
    if (!itemsResponse.ok) {
      throw new Error(`Failed to fetch items: ${itemsResponse.status}`);
    }
    
    const itemsData = await itemsResponse.json();
    const items = itemsData.data;
    
    // Process and categorize all items
    const categorizedItems = {
      starters: [] as Item[],
      boots: [] as Item[],
      mythics: [] as Item[],
      legendaries: [] as Item[]
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
      
      // Create base item object
      const baseItem: Item = {
        id: itemId,
        name: item.name,
        icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/${itemId}.png`,
        price: item.gold.total,
        description: item.plaintext || item.description,
        stats: item.stats,
        tags: item.tags
      };
      
      // Identify starter items (cheaper items typically bought at start)
      if (item.gold.total <= 500 && item.depth >= 2) {
        categorizedItems.starters.push(baseItem);
      }
      
      // Identify boots
      else if (item.tags.includes("Boots") && item.depth >= 2) {
        categorizedItems.boots.push(baseItem);
      }
      
      // Identify mythic items
      else if (item.description && 
              (item.description.includes("Mythic") || 
               item.description.includes("Huyền thoại"))) {
        categorizedItems.mythics.push(baseItem);
      }
      
      // Identify legendary items (expensive completed items)
      else if (item.gold.total >= 2000 && !item.into && item.depth >= 3) {
        categorizedItems.legendaries.push(baseItem);
      }
    });
    
    // Determine champion build type
    const buildType = determineBuildType(championData);
    
    // Filter items based on build type
    const filteredItems = filterItemsByBuildType(categorizedItems, buildType);
    
    // Build recommendation structure
    return {
      starters: filteredItems.starters.slice(0, 2),
      boots: filteredItems.boots.slice(0, 2),
      coreItems: [...filteredItems.mythics.slice(0, 1), ...filteredItems.legendaries.slice(0, 2)],
      luxuryItems: filteredItems.legendaries.slice(0, 3)
    };
  } catch (error) {
    console.error("Error generating build recommendations:", error);
    return getFallbackRecommendations(championData);
  }
}

// Filter items based on build type
function filterItemsByBuildType(items: Record<string, Item[]>, buildType: string): Record<string, Item[]> {
  const filtered = { ...items };
  
  // Filter starter items
  filtered.starters = filtered.starters.filter(item => {
    if (buildType === 'AP') {
      return item.tags?.includes('SpellDamage') || item.tags?.includes('Mana');
    } else if (buildType === 'AD' || buildType === 'ADC') {
      return item.tags?.includes('Damage') || item.tags?.includes('AttackSpeed');
    } else if (buildType === 'Tank') {
      return item.tags?.includes('Health') || item.tags?.includes('Armor') || item.tags?.includes('SpellBlock');
    } else if (buildType === 'APSupport' || buildType === 'TankSupport') {
      return item.tags?.includes('GoldPer') || item.description?.includes('support') || item.tags?.includes('Vision');
    }
    return true;
  });
  
  // Filter boots
  filtered.boots = filtered.boots.filter(item => {
    if (buildType === 'AP' || buildType === 'APSupport') {
      // Mage boots - prioritize magic pen or CDR
      return item.description?.includes('Magic Penetration') || item.description?.includes('Ability Haste');
    } else if (buildType === 'ADC') {
      // ADC boots - prioritize attack speed
      return item.description?.includes('Attack Speed') || item.name?.includes('Berserker');
    } else if (buildType === 'Tank' || buildType === 'TankSupport') {
      // Tank boots - prioritize defensive stats
      return item.description?.includes('Armor') || item.description?.includes('Magic Resist') || item.description?.includes('Tenacity');
    }
    return true;
  });
  
  // Filter mythic items
  filtered.mythics = filtered.mythics.filter(item => {
    if (buildType === 'AP') {
      return item.tags?.includes('SpellDamage') || item.tags?.includes('Mana');
    } else if (buildType === 'AD') {
      return item.tags?.includes('Damage') && !item.tags?.includes('CriticalStrike');
    } else if (buildType === 'ADC') {
      return item.tags?.includes('Damage') && (item.tags?.includes('CriticalStrike') || item.tags?.includes('AttackSpeed'));
    } else if (buildType === 'Tank') {
      return item.tags?.includes('Health') && (item.tags?.includes('Armor') || item.tags?.includes('SpellBlock'));
    } else if (buildType === 'APSupport') {
      return item.tags?.includes('SpellDamage') && item.description?.toLowerCase().includes('support');
    } else if (buildType === 'TankSupport') {
      return item.tags?.includes('Health') && item.description?.toLowerCase().includes('support');
    }
    return true;
  });
  
  // Filter legendary items
  filtered.legendaries = filtered.legendaries.filter(item => {
    if (buildType === 'AP') {
      return item.tags?.includes('SpellDamage');
    } else if (buildType === 'AD') {
      return item.tags?.includes('Damage') && !item.tags?.includes('CriticalStrike');
    } else if (buildType === 'ADC') {
      return item.tags?.includes('Damage') && (item.tags?.includes('CriticalStrike') || item.tags?.includes('AttackSpeed'));
    } else if (buildType === 'Tank') {
      return item.tags?.includes('Health') || item.tags?.includes('Armor') || item.tags?.includes('SpellBlock');
    } else if (buildType === 'APSupport') {
      return (item.tags?.includes('SpellDamage') || item.tags?.includes('ManaRegen')) && 
             !item.description?.includes('Mythic');
    } else if (buildType === 'TankSupport') {
      return (item.tags?.includes('Health') || item.tags?.includes('Armor') || item.tags?.includes('SpellBlock')) && 
             !item.description?.includes('Mythic');
    }
    return true;
  });
  
  // Sort each category for further refinement
  filtered.starters.sort((a, b) => (b.price || 0) - (a.price || 0));
  filtered.boots.sort((a, b) => (b.price || 0) - (a.price || 0));
  filtered.mythics.sort((a, b) => (b.price || 0) - (a.price || 0));
  filtered.legendaries.sort((a, b) => (b.price || 0) - (a.price || 0));
  
  return filtered;
}

// Get fallback recommendations if the API fails
export function getFallbackRecommendations(championData: any): BuildRecommendations {
  const buildType = determineBuildType(championData);
  
  // Define some simple fallback recommendations based on build type
  const fallbackItems: Record<string, BuildRecommendations> = {
    AP: {
      starters: [
        { id: "1056", name: "Doran's Ring", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/1056.png` },
        { id: "1082", name: "Dark Seal", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/1082.png` }
      ],
      boots: [
        { id: "3020", name: "Sorcerer's Shoes", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3020.png` }
      ],
      coreItems: [
        { id: "6655", name: "Luden's Tempest", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/6655.png` },
        { id: "3157", name: "Zhonya's Hourglass", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3157.png` }
      ],
      luxuryItems: [
        { id: "3089", name: "Rabadon's Deathcap", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3089.png` },
        { id: "3135", name: "Void Staff", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3135.png` }
      ]
    },
    AD: {
      starters: [
        { id: "1055", name: "Doran's Blade", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/1055.png` },
        { id: "1036", name: "Long Sword", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/1036.png` }
      ],
      boots: [
        { id: "3047", name: "Plated Steelcaps", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3047.png` }
      ],
      coreItems: [
        { id: "6692", name: "Eclipse", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/6692.png` },
        { id: "3071", name: "Black Cleaver", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3071.png` }
      ],
      luxuryItems: [
        { id: "6694", name: "Serylda's Grudge", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/6694.png` },
        { id: "6333", name: "Death's Dance", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/6333.png` }
      ]
    },
    ADC: {
      starters: [
        { id: "1055", name: "Doran's Blade", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/1055.png` }
      ],
      boots: [
        { id: "3006", name: "Berserker's Greaves", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3006.png` }
      ],
      coreItems: [
        { id: "6672", name: "Kraken Slayer", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/6672.png` },
        { id: "3031", name: "Infinity Edge", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3031.png` }
      ],
      luxuryItems: [
        { id: "3072", name: "Bloodthirster", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3072.png` },
        { id: "3036", name: "Lord Dominik's Regards", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3036.png` }
      ]
    },
    Tank: {
      starters: [
        { id: "1054", name: "Doran's Shield", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/1054.png` }
      ],
      boots: [
        { id: "3047", name: "Plated Steelcaps", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3047.png` },
        { id: "3111", name: "Mercury's Treads", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3111.png` }
      ],
      coreItems: [
        { id: "3068", name: "Sunfire Aegis", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3068.png` },
        { id: "3075", name: "Thornmail", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3075.png` }
      ],
      luxuryItems: [
        { id: "3065", name: "Spirit Visage", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3065.png` },
        { id: "3143", name: "Randuin's Omen", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3143.png` }
      ]
    },
    APSupport: {
      starters: [
        { id: "3850", name: "Spellthief's Edge", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3850.png` }
      ],
      boots: [
        { id: "3158", name: "Ionian Boots of Lucidity", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3158.png` }
      ],
      coreItems: [
        { id: "6617", name: "Moonstone Renewer", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/6617.png` },
        { id: "3504", name: "Ardent Censer", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3504.png` }
      ],
      luxuryItems: [
        { id: "3011", name: "Chemtech Putrifier", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3011.png` },
        { id: "3107", name: "Redemption", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3107.png` }
      ]
    },
    TankSupport: {
      starters: [
        { id: "3858", name: "Relic Shield", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3858.png` }
      ],
      boots: [
        { id: "3111", name: "Mercury's Treads", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3111.png` }
      ],
      coreItems: [
        { id: "3190", name: "Locket of the Iron Solari", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3190.png` },
        { id: "3109", name: "Knight's Vow", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3109.png` }
      ],
      luxuryItems: [
        { id: "3050", name: "Zeke's Convergence", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3050.png` },
        { id: "3107", name: "Redemption", icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/item/3107.png` }
      ]
    }
  };
  
  // Return fallback recommendations based on build type
  return fallbackItems[buildType] || fallbackItems.AP;
} 