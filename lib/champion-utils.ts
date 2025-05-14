import { fetchRunes, fetchSummonerSpells } from './api';

// Type definitions for runes and summoner spells
export interface Rune {
  id: number;
  key: string;
  icon: string;
  name: string;
  shortDesc: string;
  longDesc: string;
}

export interface RunePath {
  id: number;
  key: string;
  icon: string;
  name: string;
}

export interface SummonerSpell {
  id: string;
  name: string;
  description: string;
  image: {
    full: string;
  };
  cooldown: number[];
  key: string;
}

export interface RuneRecommendation {
  primary: {
    path: RunePath;
    keystone: Rune;
    runes: Rune[];
  };
  secondary: {
    path: RunePath;
    runes: Rune[];
  };
  shards: string[];
}

// Function to get champion position based on tags and other attributes
function getChampionPosition(champion: any): string {
  const tags = champion.tags || [];
  
  if (tags.includes('Marksman')) {
    return 'ADC';
  } else if (tags.includes('Support')) {
    return 'SUPPORT';
  } else if (tags.includes('Tank') && !tags.includes('Fighter')) {
    return 'TOP';
  } else if (tags.includes('Mage') && !tags.includes('Support')) {
    return 'MID';
  } else if (tags.includes('Assassin')) {
    return 'MID';
  } else if (tags.includes('Fighter') || tags.includes('Tank')) {
    // Check for jungle specific properties
    if (champion.info && champion.info.difficulty < 5) {
      return 'JUNGLE';
    }
    return 'TOP';
  }
  
  // Default position
  return 'MID';
}

// Function to determine champion play style
function getChampionPlayStyle(champion: any): string {
  const tags = champion.tags || [];
  
  if (tags.includes('Mage') || tags.includes('Assassin')) {
    return 'AP';
  } else if (tags.includes('Marksman')) {
    return 'ADC';
  } else if (tags.includes('Tank')) {
    return 'TANK';
  } else if (tags.includes('Fighter')) {
    // Check stats to determine AD or AP fighter
    if (champion.info && champion.info.magic > champion.info.attack) {
      return 'AP';
    }
    return 'AD';
  } else if (tags.includes('Support')) {
    if (champion.info && champion.info.magic > 5) {
      return 'AP_SUPPORT';
    }
    return 'UTILITY_SUPPORT';
  }
  
  // Default play style
  return 'AD';
}

// Function to get recommended runes based on champion data
export async function getRecommendedRunes(champion: any): Promise<RuneRecommendation> {
  try {
    const runesData = await fetchRunes();
    const position = getChampionPosition(champion);
    const playStyle = getChampionPlayStyle(champion);
    
    // Determine primary and secondary rune paths based on play style
    let primaryPathKey = 'Precision';
    let secondaryPathKey = 'Domination';
    let keystoneId = 8005; // Press the Attack (default)
    
    switch (playStyle) {
      case 'AP':
        primaryPathKey = 'Sorcery';
        secondaryPathKey = 'Domination';
        keystoneId = 8214; // Summon Aery
        break;
      case 'ADC':
        primaryPathKey = 'Precision';
        secondaryPathKey = 'Domination';
        keystoneId = 8008; // Lethal Tempo
        break;
      case 'TANK':
        primaryPathKey = 'Resolve';
        secondaryPathKey = 'Inspiration';
        keystoneId = 8437; // Grasp of the Undying
        break;
      case 'AD':
        primaryPathKey = 'Precision';
        secondaryPathKey = 'Domination';
        keystoneId = 8005; // Press the Attack
        break;
      case 'AP_SUPPORT':
        primaryPathKey = 'Sorcery';
        secondaryPathKey = 'Inspiration';
        keystoneId = 8214; // Summon Aery
        break;
      case 'UTILITY_SUPPORT':
        primaryPathKey = 'Resolve';
        secondaryPathKey = 'Inspiration';
        keystoneId = 8465; // Guardian
        break;
    }
    
    // Find the primary and secondary paths
    const primaryPath = runesData.find((path: any) => path.key === primaryPathKey);
    const secondaryPath = runesData.find((path: any) => path.key === secondaryPathKey);
    
    if (!primaryPath || !secondaryPath) {
      throw new Error('Could not find rune paths');
    }
    
    // Find the keystone rune
    const keystone = primaryPath.slots[0].runes.find((rune: any) => rune.id === keystoneId) || 
                     primaryPath.slots[0].runes[0];
    
    // Select suitable runes from primary path (skip the keystone slot)
    const primaryRunes = [];
    for (let i = 1; i < primaryPath.slots.length && i < 4; i++) {
      primaryRunes.push(primaryPath.slots[i].runes[0]); // Choose the first rune in each slot
    }
    
    // Select suitable runes from secondary path (only 2 runes)
    const secondaryRunes = [
      secondaryPath.slots[1].runes[0], // First rune from second slot
      secondaryPath.slots[2].runes[0]  // First rune from third slot
    ];
    
    // Default stat shards
    const statShards = [
      'Adaptive Force', 
      'Adaptive Force', 
      playStyle === 'TANK' ? 'Health' : 'Armor'
    ];
    
    return {
      primary: {
        path: {
          id: primaryPath.id,
          key: primaryPath.key,
          icon: primaryPath.icon,
          name: primaryPath.name
        },
        keystone: {
          id: keystone.id,
          key: keystone.key,
          icon: keystone.icon,
          name: keystone.name,
          shortDesc: keystone.shortDesc,
          longDesc: keystone.longDesc
        },
        runes: primaryRunes.map(rune => ({
          id: rune.id,
          key: rune.key,
          icon: rune.icon,
          name: rune.name,
          shortDesc: rune.shortDesc,
          longDesc: rune.longDesc
        }))
      },
      secondary: {
        path: {
          id: secondaryPath.id,
          key: secondaryPath.key,
          icon: secondaryPath.icon,
          name: secondaryPath.name
        },
        runes: secondaryRunes.map(rune => ({
          id: rune.id,
          key: rune.key,
          icon: rune.icon,
          name: rune.name,
          shortDesc: rune.shortDesc,
          longDesc: rune.longDesc
        }))
      },
      shards: statShards
    };
  } catch (error) {
    console.error('Error in getRecommendedRunes:', error);
    // Return a default recommendation
    return {
      primary: {
        path: {
          id: 8000,
          key: 'Precision',
          icon: 'perk-images/Styles/7201_Precision.png',
          name: 'Chính Xác'
        },
        keystone: {
          id: 8008,
          key: 'LethalTempo',
          icon: 'perk-images/Styles/Precision/LethalTempo/LethalTempo.png',
          name: 'Nhịp Độ Chết Người',
          shortDesc: 'Đánh trúng tướng địch sẽ cho Tốc Độ Đánh trong 6 giây.',
          longDesc: 'Đánh trúng tướng địch cho thêm 40-110% Tốc Độ Đánh (tùy cấp) trong 6 giây, có thể vượt quá giới hạn Tốc Độ Đánh.'
        },
        runes: []
      },
      secondary: {
        path: {
          id: 8100,
          key: 'Domination',
          icon: 'perk-images/Styles/7200_Domination.png',
          name: 'Áp Đảo'
        },
        runes: []
      },
      shards: ['Adaptive Force', 'Adaptive Force', 'Armor']
    };
  }
}

// Function to get recommended summoner spells based on champion data
export async function getRecommendedSummonerSpells(champion: any): Promise<SummonerSpell[]> {
  try {
    const spellsData = await fetchSummonerSpells();
    const position = getChampionPosition(champion);
    
    // Define spell pairs based on position
    const spellPairs: Record<string, string[]> = {
      'TOP': ['SummonerTeleport', 'SummonerFlash'],
      'JUNGLE': ['SummonerSmite', 'SummonerFlash'],
      'MID': ['SummonerFlash', 'SummonerDot'],
      'ADC': ['SummonerFlash', 'SummonerHeal'],
      'SUPPORT': ['SummonerFlash', 'SummonerExhaust']
    };
    
    const spellKeys = spellPairs[position] || ['SummonerFlash', 'SummonerDot'];
    const spells = Object.values(spellsData.data).filter((spell: any) => 
      spellKeys.includes(spell.id)
    );
    
    // Ensure we have 2 spells, fill with any if needed
    if (spells.length < 2) {
      const additionalSpells = Object.values(spellsData.data).filter((spell: any) => 
        !spellKeys.includes(spell.id) && spell.id !== 'SummonerMana' // Exclude Clarity
      );
      
      while (spells.length < 2 && additionalSpells.length > 0) {
        spells.push(additionalSpells.shift());
      }
    }
    
    return spells.map((spell: any) => ({
      id: spell.id,
      name: spell.name,
      description: spell.description,
      image: {
        full: spell.image.full
      },
      cooldown: spell.cooldown,
      key: spell.key
    }));
  } catch (error) {
    console.error('Error in getRecommendedSummonerSpells:', error);
    // Return default summoner spells
    return [
      {
        id: 'SummonerFlash',
        name: 'Tốc Biến',
        description: 'Dịch chuyển ngay tức khắc một đoạn ngắn về phía trỏ chuột.',
        image: {
          full: 'SummonerFlash.png'
        },
        cooldown: [300],
        key: '4'
      },
      {
        id: 'SummonerDot',
        name: 'Thiêu Đốt',
        description: 'Đốt cháy kẻ địch, gây sát thương chuẩn theo thời gian và giảm hiệu quả hồi máu.',
        image: {
          full: 'SummonerDot.png'
        },
        cooldown: [180],
        key: '14'
      }
    ];
  }
} 