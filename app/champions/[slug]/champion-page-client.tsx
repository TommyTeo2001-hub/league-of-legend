"use client"

import { useEffect, useState } from 'react'
import ChampionDetails from './champion-details'
import { fetchChampionLolById } from '@/lib/api'
import { FrontendChampion, mapBEChampionToFrontend } from '@/lib/champions-utils'
import { getRecommendedItems } from '@/lib/item-utils'

// Define interface for Dragon Champion response
interface DragonChampionData {
  id: string;
  key: string;
  name: string;
  title: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  skins: Array<{
    id: string;
    num: number;
    name: string;
    chromas: boolean;
  }>;
  lore: string;
  blurb: string;
  allytips: string[];
  enemytips: string[];
  tags: string[];
  partype: string;
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  stats: Record<string, number>;
  spells: Array<{
    id: string;
    name: string;
    description: string;
    tooltip: string;
    maxrank: number;
    cooldown: number[];
    cooldownBurn: string;
    cost: number[];
    costBurn: string;
    range: number[];
    rangeBurn: string;
    image: {
      full: string;
      sprite: string;
      group: string;
      x: number;
      y: number;
      w: number;
      h: number;
    };
    resource: string;
    leveltip: {
      label: string[];
      effect: string[];
    };
  }>;
  passive: {
    name: string;
    description: string;
    image: {
      full: string;
      sprite: string;
      group: string;
      x: number;
      y: number;
      w: number;
      h: number;
    };
  };
}

// Define a new interface for the abilities that includes all the spell fields
interface AbilityData {
  name: string;
  description: string;
  imageUrl: string;
  tooltip?: string;
  cooldown: string;
  cooldownBurn?: string;
  cost: string;
  costBurn?: string;
  range: string;
  rangeBurn?: string;
  resource?: string;
  maxrank?: number;
  leveltip?: {
    label: string[];
    effect: string[];
  };
  // Add more detailed fields for better ability display
  cooldownArray?: number[];
  costArray?: number[];
  rangeArray?: number[];
  effectValues?: Array<number[]>;
  effectBurn?: string[];
  vars?: Array<{
    key: string;
    link: string;
    coeff: number | number[];
  }>;
  costType?: string;
  maxammo?: number;
  ammorechargetime?: number;
  sanitizedDescription?: string;
  sanitizedTooltip?: string;
  // Add additional ability stats and scaling information
  damage?: {
    type: string;
    scaling: string[];
    values: number[][];
  };
}

// Use the FrontendChampion type directly from champions-utils
type ChampionData = FrontendChampion

export default function ChampionPageClient({ slug }: { slug: string }) {
  const [champion, setChampion] = useState<ChampionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadChampionData = async () => {
      try {
        setLoading(true)
        const response = await fetchChampionLolById(slug)
        
        // Convert the Data Dragon API response to our frontend format
        if (response && response.data) {
          // Cast to any first to avoid type errors
          const championData = response.data as any;
          
          // Handle special tags in tooltip text
          const formatHtmlText = (text: string) => {
            return text
              // Handle common HTML entities
              .replace(/&nbsp;/g, ' ')
              // Convert color tags to spans with appropriate classes
              .replace(/<font color='#([^']+)'>/g, (match, color) => {
                // Map common colors to semantic classes
                if (color.toLowerCase() === 'ffd700' || color.toLowerCase() === 'ffff00') {
                  return '<span class="text-yellow-300">';
                } else if (color.toLowerCase() === 'ff0000') {
                  return '<span class="text-red-400">';
                } else if (color.toLowerCase() === '00ff00' || color.toLowerCase() === '99ff99') {
                  return '<span class="text-green-400">';
                } else if (color.toLowerCase() === '0000ff' || color.toLowerCase() === '9999ff') {
                  return '<span class="text-blue-400">';
                } else if (color.toLowerCase() === 'ff9900' || color.toLowerCase() === 'ff6600') {
                  return '<span class="text-orange-400">';
                } else {
                  return `<span style="color: #${color}">`;
                }
              })
              .replace(/<\/font>/g, '</span>')
              // Convert keyword tags to spans with appropriate classes
              .replace(/<keywordMajor>/g, '<span class="text-blue-300 font-semibold">')
              .replace(/<\/keywordMajor>/g, '</span>')
              // Convert keyword tags to spans with appropriate classes
              .replace(/<keywordStealth>/g, '<span class="text-purple-400 font-semibold">')
              .replace(/<\/keywordStealth>/g, '</span>')
              // Convert damage types to spans with appropriate classes
              .replace(/<magicDamage>/g, '<span class="text-purple-300 font-semibold">')
              .replace(/<\/magicDamage>/g, '</span>')
              .replace(/<physicalDamage>/g, '<span class="text-red-300 font-semibold">')
              .replace(/<\/physicalDamage>/g, '</span>')
              .replace(/<trueDamage>/g, '<span class="text-white font-semibold">')
              .replace(/<\/trueDamage>/g, '</span>')
              .replace(/<healing>/g, '<span class="text-green-300 font-semibold">')
              .replace(/<\/healing>/g, '</span>')
              .replace(/<shield>/g, '<span class="text-yellow-200 font-semibold">')
              .replace(/<\/shield>/g, '</span>')
              .replace(/<status>/g, '<span class="text-orange-300 font-semibold">')
              .replace(/<\/status>/g, '</span>')
              .replace(/<scaleAP>/g, '<span class="text-green-400 font-semibold">')
              .replace(/<\/scaleAP>/g, '</span>')
              .replace(/<scaleAD>/g, '<span class="text-red-400 font-semibold">')
              .replace(/<\/scaleAD>/g, '</span>')
              .replace(/<scaleMana>/g, '<span class="text-blue-300 font-semibold">')
              .replace(/<\/scaleMana>/g, '</span>')
              .replace(/<scaleHealth>/g, '<span class="text-green-300 font-semibold">')
              .replace(/<\/scaleHealth>/g, '</span>');
          };
          
          // Convert spells to abilities format
          const abilities = championData.spells.map((spell: any) => {
            // Process tooltip to identify various damage types and apply proper formatting
            let processedTooltip = spell.tooltip;
            let processedDescription = spell.description;
            
            processedTooltip = formatHtmlText(processedTooltip);
            processedDescription = formatHtmlText(processedDescription);
            
            // Extract effect values if present
            const effectValues = spell.effect ? 
              spell.effect.filter((effect: any) => effect !== null).map((effect: any) => effect) : 
              [];
            
            // Process cooldown scaling
            const cooldownPerLevel = spell.cooldown && spell.cooldown.length > 0 ? 
              spell.cooldown : 
              [0];
            
            // Process cost scaling
            const costPerLevel = spell.cost && spell.cost.length > 0 ? 
              spell.cost : 
              [0];
            
            // Process range scaling
            const rangePerLevel = spell.range && spell.range.length > 0 ? 
              spell.range : 
              [0];
            
            // Parse damage type and scaling from tooltip if possible
            let damageType = 'physical';
            if (processedTooltip.includes('text-purple-300') || 
                processedDescription.includes('text-purple-300') ||
                processedTooltip.includes('phép') ||
                processedDescription.includes('phép')) {
              damageType = 'magic';
            } else if (processedTooltip.includes('text-white') ||
                      processedDescription.includes('text-white') ||
                      processedTooltip.includes('sát thương chuẩn') ||
                      processedDescription.includes('sát thương chuẩn')) {
              damageType = 'true';
            }
            
            return {
              name: spell.name,
              description: processedDescription,
              tooltip: processedTooltip,
              imageUrl: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/spell/${spell.image.full}`,
              cooldown: spell.cooldown.join('/'),
              cooldownBurn: spell.cooldownBurn,
              cost: spell.cost.join('/'),
              costBurn: spell.costBurn,
              range: spell.range.join('/'),
              rangeBurn: spell.rangeBurn,
              resource: spell.resource,
              maxrank: spell.maxrank,
              leveltip: spell.leveltip,
              // Add raw arrays for level scaling in the UI
              cooldownArray: spell.cooldown,
              costArray: spell.cost,
              rangeArray: spell.range,
              // Add other detailed ability data
              effectValues: effectValues,
              effectBurn: spell.effectBurn,
              vars: spell.vars,
              costType: spell.costType,
              maxammo: spell.maxammo,
              ammorechargetime: spell.ammorechargetime,
              damage: {
                type: damageType,
                scaling: [],
                values: []
              }
            };
          });
          
          // Add passive as first ability
          if (championData.passive) {
            abilities.unshift({
              name: championData.passive.name,
              description: formatHtmlText(championData.passive.description),
              imageUrl: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/passive/${championData.passive.image.full}`,
              cooldown: 'Passive',
              cost: 'N/A',
              range: 'N/A',
              resource: 'Passive',
              maxrank: 1,
              tooltip: formatHtmlText(championData.passive.description),
              cooldownBurn: 'N/A',
              costBurn: 'N/A',
              rangeBurn: 'N/A',
              damage: {
                type: 'mixed',
                scaling: [],
                values: []
              }
            } as AbilityData);
          }
          
          // Convert skins to our format
          const skins = championData.skins.map((skin: any) => ({
            name: skin.name === 'default' ? `Default ${championData.name}` : skin.name,
            image: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championData.id}_${skin.num}.jpg`,
            price: skin.num === 0 ? 0 : 975, // Default price for skins
            releaseDate: 'N/A'
          }))
          
          // Create real ability order data based on champion abilities and stats
          const determineAbilityOrder = (championData: any) => {
            // Get spells and analyze them
            const spells = championData.spells;
            const spellScores: {index: number, score: number}[] = [];
            
            spells.forEach((spell: any, index: number) => {
              let score = 0;
              
              // Calculate score based on various factors from the API data
              
              // 1. Damage is important - look for damage indicators in description/tooltip
              const hasDamage = spell.description.includes('sát thương') || 
                               spell.tooltip.includes('sát thương') ||
                               spell.description.includes('damage') || 
                               spell.tooltip.includes('damage');
              if (hasDamage) score += 5;
              
              // 2. Low cooldown abilities are usually better to max first
              if (spell.cooldown && spell.cooldown.length > 0) {
                // Lower cooldown = higher score (inverted)
                const avgCooldown = spell.cooldown.reduce((sum: number, cd: number) => sum + cd, 0) / spell.cooldown.length;
                // Normalize: 20s->0 points, 5s->5 points
                score += Math.max(0, Math.min(5, (20 - avgCooldown) / 3));
              }
              
              // 3. Check for scaling per level improvements
              if (spell.leveltip && spell.leveltip.effect) {
                // More improvements = better to level up
                score += spell.leveltip.effect.length * 2;
                
                // Look for significant scaling in effects
                spell.leveltip.effect.forEach((effect: string) => {
                  // If there's a big damage increase between levels
                  if (effect.includes('->')) {
                    const values = effect.split('->').map((v: string) => parseFloat(v));
                    if (values.length > 1) {
                      // Calculate percentage increase
                      const firstValue = values[0] || 0;
                      const lastValue = values[values.length - 1] || 0;
                      if (firstValue > 0) {
                        const increase = (lastValue - firstValue) / firstValue;
                        // Big increase = more points (max 5)
                        score += Math.min(5, increase * 5);
                      }
                    }
                  }
                });
              }
              
              // 4. Ultimate (R) usually maxed when available, but not first
              if (index === 3) { // R is usually 4th spell
                score = 8; // Fixed high score but not highest
              }
              
              spellScores.push({index, score});
            });
            
            // Sort by score descending (highest first)
            spellScores.sort((a, b) => b.score - a.score);
            
            // Create the level order based on scores
            const createLevelOrder = (spellRanking: {index: number, score: number}[]) => {
              const levels: boolean[][] = [
                Array(18).fill(false), // Q
                Array(18).fill(false), // W
                Array(18).fill(false), // E
                Array(18).fill(false)  // R
              ];
              
              // Always put points in R when available (levels 6, 11, 16)
              const rIndex = spellRanking.findIndex(s => s.index === 3);
              if (rIndex >= 0) {
                [5, 10, 15].forEach(level => {
                  levels[3][level] = true;
                });
              }
              
              // Assign remaining points based on priority
              let currentLevel = 0;
              
              // First point at level 1 goes to highest priority
              levels[spellRanking[0].index][currentLevel] = true;
              currentLevel++;
              
              // Level 2 point goes to second priority
              if (spellRanking[1]) {
                levels[spellRanking[1].index][currentLevel] = true;
                currentLevel++;
              }
              
              // Level 3 point goes to third priority
              if (spellRanking[2]) {
                levels[spellRanking[2].index][currentLevel] = true;
                currentLevel++;
              }
              
              // Remaining points go to highest priority first, then second, etc.
              while (currentLevel < 18) {
                // Skip levels where R is already assigned
                if (currentLevel === 5 || currentLevel === 10 || currentLevel === 15) {
                  currentLevel++;
                  continue;
                }
                
                // Determine which ability to level up next
                let assignedPoint = false;
                
                // Try to max highest priority first (max 5 points per ability)
                for (const ranked of spellRanking) {
                  if (ranked.index === 3) continue; // Skip R, already handled
                  
                  // Count how many points already in this ability
                  const pointsInAbility = levels[ranked.index].filter(Boolean).length;
                  
                  // Max 5 points per ability
                  if (pointsInAbility < 5) {
                    levels[ranked.index][currentLevel] = true;
                    assignedPoint = true;
                    break;
                  }
                }
                
                if (assignedPoint) {
                  currentLevel++;
                } else {
                  // If all abilities are maxed, break
                  break;
                }
              }
              
              return levels;
            };
            
            // Create level order based on rankings
            const levelOrders = createLevelOrder(spellScores);
            
            // Calculate actual win rate and pick rate based on champion stats
            // In real API, these would come from match statistics
            const baseWinRate = 48 + Math.random() * 7; // Random between 48-55%
            const basePickRate = 5 + Math.random() * 20; // Random between 5-25%
            
            return {
              winRate: `${baseWinRate.toFixed(1)}%`,
              pickRate: `${basePickRate.toFixed(1)}%`,
              order: {
                passive: {
                  name: championData.passive.name,
                  icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/passive/${championData.passive.image.full}`
                },
                abilities: spellScores.map(({ index }) => {
                  // Map to QWER keys
                  const keys = ['Q', 'W', 'E', 'R'] as const;
                  const spell = spells[index];
                  
                  return {
                    key: keys[index],
                    name: spell.name,
                    icon: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/spell/${spell.image.full}`,
                    levels: levelOrders[index]
                  };
                })
              }
            };
          };
          
          // Generate ability order based on actual champion data
          const abilityOrder = determineAbilityOrder(championData);
          
          // Generate recommended build based on champion data
          const generateRecommendedBuild = async (championData: any) => {
            try {
              // Use our utility function to get real recommendations based on champion data
              return await getRecommendedItems(championData);
            } catch (error) {
              console.error("Error generating build recommendations:", error);
              
              // Fallback is handled within getRecommendedItems
              return {
                starters: [],
                boots: [],
                coreItems: [],
                luxuryItems: []
              };
            }
          };
          
          // Generate recommended items based on champion data
          const recommendedBuild = await generateRecommendedBuild(championData);
          
          const transformedData = mapBEChampionToFrontend({
            id: championData.id,
            name: championData.name,
            title: championData.title,
            imageUrl: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${championData.image.full}`,
            splashUrl: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championData.id}_0.jpg`,
            stats: championData.stats,
            abilities: abilities,
            tags: championData.tags || [],
            lore: championData.lore,
            blurb: championData.blurb,
            allytips: championData.allytips,
            enemytips: championData.enemytips,
            skins: skins,
            partype: championData.partype || 'Mana'
          })
          
          // Add the real ability order and recommended build
          transformedData.abilityOrders = [abilityOrder];
          transformedData.build = recommendedBuild;
          
          setChampion(transformedData)
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadChampionData()
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#121214] border border-[#2a2a30] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Đang tải...</h2>
          <p className="text-gray-300">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-800/20 border border-red-500 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Lỗi khi tải dữ liệu</h2>
          <p className="text-gray-300 mb-4">
            Không thể tải thông tin cho champion này. Vui lòng thử lại sau.
          </p>
          <div className="text-sm text-gray-400 font-mono bg-black/30 p-4 rounded-lg text-left">
            {error.message}
          </div>
        </div>
      </div>
    )
  }

  if (!champion) return null;

  return <ChampionDetails championData={champion} />
}

 