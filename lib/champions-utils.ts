// Define the BE champion interface to support all Dragon API fields
export interface BEChampion {
  _id?: string;
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  splashUrl: string;
  stats: Record<string, number>;
  abilities: BEChampionAbility[];
  tags: string[];
  counters?: string[];
  strongAgainst?: string[];
  recommendedRunes?: any[];
  recommendedItems?: any[];
  __v?: number;
  // Additional Data Dragon API fields
  lore?: string;
  blurb?: string;
  allytips?: string[];
  enemytips?: string[];
  skins?: Array<{
    name: string;
    image: string;
    price: number;
    releaseDate: string;
  }>;
  partype?: string;
}

export interface BEChampionAbility {
  name: string;
  description: string;
  imageUrl: string;
  cooldown?: string;
  cost?: string;
  range?: string;
}

// Define the frontend champion interface
export interface FrontendChampion {
  id: string;
  name: string;
  title: string;
  role: string;
  difficulty: string;
  img: string;
  image: string;
  pickRate: string;
  winRate: string;
  banRate: string;
  patch: string;
  matchesScanned: string;
  stats: {
    health: number;
    mana: number;
    armor: number;
    magicResist: number;
    attackDamage: number;
    attackSpeed: number;
    [key: string]: number;
  };
  abilities: {
    [key: string]: {
      name: string;
      description: string;
      icon: string;
      cost?: string;
      cooldown?: string;
      range?: string;
      tooltip?: string;
      cooldownBurn?: string;
      costBurn?: string;
      rangeBurn?: string;
      resource?: string;
      maxrank?: number;
      leveltip?: {
        label: string[];
        effect: string[];
      };
      cooldownArray?: number[];
      costArray?: number[];
    };
  };
  counters: {
    strong: Array<{
      name: string;
      rating: number;
      image: string;
    }>;
    weak: Array<{
      name: string;
      rating: number;
      image: string;
    }>;
  };
  runes: {
    primary: Array<{
      name: string;
      icon: string;
      category: string;
      winRate: string;
      pickRate: string;
    }>;
    secondary: Array<{
      name: string;
      icon: string;
      category: string;
      winRate: string;
      pickRate: string;
    }>;
  };
  summonerSpells: Array<{
    name: string;
    icon: string;
  }>;
  build: {
    starters: Array<{
      name: string;
      icon: string;
    }>;
    coreItems: Array<{
      name: string;
      icon: string;
    }>;
    luxuryItems: Array<{
      name: string;
      icon: string;
    }>;
    boots: Array<{
      name: string;
      icon: string;
    }>;
  };
  abilityOrders: Array<{
    winRate: string;
    pickRate: string;
    order: {
      passive: {
        name: string;
        icon: string;
      };
      abilities: Array<{
        key: 'Q' | 'W' | 'E' | 'R';
        name: string;
        icon: string;
        levels: boolean[];
      }>;
    };
  }>;
  // Additional fields from Data Dragon API
  lore?: string;
  blurb?: string;
  allytips?: string[];
  enemytips?: string[];
  skins?: Array<{
    name: string;
    image: string;
    price: number;
    releaseDate: string;
  }>;
  partype?: string;
}

// Helper function to determine champion role from tags
function determineRole(tags: string[]): string {
  if (tags.includes('Marksman')) return 'Marksman';
  if (tags.includes('Support')) return 'Support';
  if (tags.includes('Mage')) return 'Mage';
  if (tags.includes('Fighter')) return 'Fighter';
  if (tags.includes('Tank')) return 'Tank';
  if (tags.includes('Assassin')) return 'Assassin';
  return 'Fighter'; // Default
}

// Helper function to determine champion difficulty
function determineDifficulty(champion: BEChampion): string {
  // This is a placeholder. In real implementation, you might want to use
  // some actual data from the BE to determine difficulty
  const difficultyOptions = ['Easy', 'Moderate', 'High'];
  return difficultyOptions[Math.floor(Math.random() * difficultyOptions.length)];
}

// Convert BE champion abilities to frontend format
function convertAbilities(abilities: BEChampionAbility[]): FrontendChampion['abilities'] {
  const result: FrontendChampion['abilities'] = {};
  
  // Default ability keys
  const abilityKeys = ['passive', 'q', 'w', 'e', 'r'];
  
  // Map abilities to keys
  abilities.forEach((ability, index) => {
    if (index < abilityKeys.length) {
      result[abilityKeys[index]] = {
        name: ability.name,
        description: ability.description,
        icon: ability.imageUrl,
        // Default values for missing properties
        cost: index === 0 ? 'Passive' : 'Unknown',
        cooldown: index === 0 ? 'N/A' : '0',
        range: index === 0 ? 'N/A' : '0'
      };
    }
  });
  
  return result;
}

// Generate placeholder data for missing fields
function generatePlaceholderData(champion: BEChampion): Partial<FrontendChampion> {
  return {
    pickRate: '10.0%',
    winRate: '50.0%',
    banRate: '5.0%',
    patch: '13.7',
    matchesScanned: '10,000+',
    counters: {
      strong: [],
      weak: []
    },
    runes: {
      primary: [
        {
          name: 'Default Rune',
          icon: champion.imageUrl,
          category: 'Precision',
          winRate: '50%',
          pickRate: '80%'
        }
      ],
      secondary: [
        {
          name: 'Default Secondary',
          icon: champion.imageUrl,
          category: 'Domination',
          winRate: '50%',
          pickRate: '80%'
        }
      ]
    },
    summonerSpells: [
      {
        name: 'Flash',
        icon: 'https://ddragon.leagueoflegends.com/cdn/13.7.1/img/spell/SummonerFlash.png'
      },
      {
        name: 'Ignite',
        icon: 'https://ddragon.leagueoflegends.com/cdn/13.7.1/img/spell/SummonerDot.png'
      }
    ],
    build: {
      starters: [
        {
          name: 'Doran\'s Item',
          icon: 'https://ddragon.leagueoflegends.com/cdn/13.7.1/img/item/1056.png'
        }
      ],
      coreItems: [
        {
          name: 'Core Item 1',
          icon: 'https://ddragon.leagueoflegends.com/cdn/13.7.1/img/item/3020.png'
        }
      ],
      luxuryItems: [
        {
          name: 'Luxury Item',
          icon: 'https://ddragon.leagueoflegends.com/cdn/13.7.1/img/item/3089.png'
        }
      ],
      boots: [
        {
          name: 'Boots',
          icon: 'https://ddragon.leagueoflegends.com/cdn/13.7.1/img/item/3158.png'
        }
      ]
    },
    abilityOrders: [
      {
        winRate: '52.3%',
        pickRate: '80.5%',
        order: {
          passive: {
            name: champion.abilities.length > 0 ? champion.abilities[0].name : 'Passive',
            icon: champion.abilities.length > 0 ? champion.abilities[0].imageUrl : champion.imageUrl
          },
          abilities: [
            {
              key: 'Q',
              name: champion.abilities.length > 1 ? champion.abilities[1].name : 'Q Ability',
              icon: champion.abilities.length > 1 ? champion.abilities[1].imageUrl : champion.imageUrl,
              levels: Array(18).fill(false).map((_, i) => i < 5)
            },
            {
              key: 'W',
              name: champion.abilities.length > 2 ? champion.abilities[2].name : 'W Ability',
              icon: champion.abilities.length > 2 ? champion.abilities[2].imageUrl : champion.imageUrl,
              levels: Array(18).fill(false).map((_, i) => i >= 5 && i < 10)
            },
            {
              key: 'E',
              name: champion.abilities.length > 3 ? champion.abilities[3].name : 'E Ability',
              icon: champion.abilities.length > 3 ? champion.abilities[3].imageUrl : champion.imageUrl,
              levels: Array(18).fill(false).map((_, i) => i >= 10 && i < 15)
            },
            {
              key: 'R',
              name: champion.abilities.length > 4 ? champion.abilities[4].name : 'R Ability',
              icon: champion.abilities.length > 4 ? champion.abilities[4].imageUrl : champion.imageUrl,
              levels: Array(18).fill(false).map((_, i) => i >= 15)
            }
          ]
        }
      }
    ]
  };
}

// Map BE champion data to frontend data structure
export function mapBEChampionToFrontend(beChampion: BEChampion): FrontendChampion {
  // Convert stats
  const stats = {
    health: beChampion.stats.hp || 0,
    mana: beChampion.stats.mp || 0,
    armor: beChampion.stats.armor || 0,
    magicResist: beChampion.stats.spellblock || 0,
    attackDamage: beChampion.stats.attackdamage || 0,
    attackSpeed: beChampion.stats.attackspeed || 0,
    ...beChampion.stats
  };

  // Get placeholder data
  const placeholderData = generatePlaceholderData(beChampion);

  // Create base champion data
  const frontendChampion: FrontendChampion = {
    id: beChampion.id,
    name: beChampion.name,
    title: beChampion.title,
    role: determineRole(beChampion.tags),
    difficulty: determineDifficulty(beChampion),
    img: beChampion.splashUrl,
    image: beChampion.imageUrl,
    stats,
    abilities: convertAbilities(beChampion.abilities),
    // Ensure all required properties have non-undefined values
    pickRate: placeholderData.pickRate || '10.0%',
    winRate: placeholderData.winRate || '50.0%',
    banRate: placeholderData.banRate || '5.0%',
    patch: placeholderData.patch || '15.9',
    matchesScanned: placeholderData.matchesScanned || '10,000+',
    counters: placeholderData.counters || { strong: [], weak: [] },
    runes: placeholderData.runes || {
      primary: [{
        name: 'Default Rune',
        icon: beChampion.imageUrl,
        category: 'Precision',
        winRate: '50%',
        pickRate: '80%'
      }],
      secondary: [{
        name: 'Default Secondary',
        icon: beChampion.imageUrl,
        category: 'Domination',
        winRate: '50%',
        pickRate: '80%'
      }]
    },
    summonerSpells: placeholderData.summonerSpells || [
      {
        name: 'Flash',
        icon: 'https://ddragon.leagueoflegends.com/cdn/15.9.1/img/spell/SummonerFlash.png'
      },
      {
        name: 'Ignite',
        icon: 'https://ddragon.leagueoflegends.com/cdn/15.9.1/img/spell/SummonerDot.png'
      }
    ],
    build: placeholderData.build || {
      starters: [{ name: 'Doran\'s Item', icon: beChampion.imageUrl }],
      coreItems: [{ name: 'Core Item 1', icon: beChampion.imageUrl }],
      luxuryItems: [{ name: 'Luxury Item', icon: beChampion.imageUrl }],
      boots: [{ name: 'Boots', icon: beChampion.imageUrl }]
    },
    abilityOrders: placeholderData.abilityOrders || [{
      winRate: '52.3%',
      pickRate: '80.5%',
      order: {
        passive: {
          name: beChampion.abilities.length > 0 ? beChampion.abilities[0].name : 'Passive',
          icon: beChampion.abilities.length > 0 ? beChampion.abilities[0].imageUrl : beChampion.imageUrl
        },
        abilities: [
          {
            key: 'Q',
            name: beChampion.abilities.length > 1 ? beChampion.abilities[1].name : 'Q Ability',
            icon: beChampion.abilities.length > 1 ? beChampion.abilities[1].imageUrl : beChampion.imageUrl,
            levels: Array(18).fill(false).map((_, i) => i < 5)
          },
          {
            key: 'W',
            name: beChampion.abilities.length > 2 ? beChampion.abilities[2].name : 'W Ability',
            icon: beChampion.abilities.length > 2 ? beChampion.abilities[2].imageUrl : beChampion.imageUrl,
            levels: Array(18).fill(false).map((_, i) => i >= 5 && i < 10)
          },
          {
            key: 'E',
            name: beChampion.abilities.length > 3 ? beChampion.abilities[3].name : 'E Ability',
            icon: beChampion.abilities.length > 3 ? beChampion.abilities[3].imageUrl : beChampion.imageUrl,
            levels: Array(18).fill(false).map((_, i) => i >= 10 && i < 15)
          },
          {
            key: 'R',
            name: beChampion.abilities.length > 4 ? beChampion.abilities[4].name : 'R Ability',
            icon: beChampion.abilities.length > 4 ? beChampion.abilities[4].imageUrl : beChampion.imageUrl,
            levels: Array(18).fill(false).map((_, i) => i >= 15)
          }
        ]
      }
    }],
    // Additional fields from Data Dragon API
    lore: beChampion.lore,
    blurb: beChampion.blurb,
    allytips: beChampion.allytips,
    enemytips: beChampion.enemytips,
    skins: beChampion.skins,
    partype: beChampion.partype
  };

  return frontendChampion;
}

// Map a list of BE champions to frontend format
export function mapBEChampionsToFrontend(beChampions: BEChampion[]): FrontendChampion[] {
  return beChampions.map(mapBEChampionToFrontend);
} 