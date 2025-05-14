// API helper functions
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_API_URL || process.env.URL || '';
}

export async function fetchChampions(game: 'league' | 'wildrift' | 'tft', page: number = 1, limit: number = 20) {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/champions/${game}?page=${page}&limit=${limit}`)
  if (!response.ok) throw new Error('Failed to fetch champions')
  return response.json()
}

export async function fetchChampionById(game: 'league' | 'wildrift' | 'tft', id: string) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/champions/${game}/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch champion: ${id}`);
    return response.json();
  } catch (error) {
    throw error;
  }
}

// Định nghĩa kiểu dữ liệu cho article
export interface NewsArticle {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  imageUrl: string;
  tags: string[];
  author: {
    _id: string;
    name: string;
  };
  published: boolean;
  publishedAt: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsResponse {
  data: {
    articles: NewsArticle[];
  }
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchNews(page: number = 1, limit: number = 20): Promise<NewsResponse> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/news?page=${page}&limit=${limit}`)
  if (!response.ok) throw new Error('Failed to fetch news')
  return response.json()
}

export async function fetchNewsById(id: string): Promise<NewsArticle> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/news/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch news article: ${id}`);
    return response.json();
  } catch (error) {
    throw error;
  }
}

export async function fetchItems() {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/items`)
  if (!response.ok) throw new Error('Failed to fetch items')
  return response.json()
}

export async function fetchItemById(id: string) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/items/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch item: ${id}`);
    return response.json();
  } catch (error) {
    throw error;
  }
}

export async function fetchCounters() {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/counters`)
  if (!response.ok) throw new Error('Failed to fetch counters')
  return response.json()
}

export async function fetchCounterById(id: string) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/counters/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch counter data for: ${id}`);
    return response.json();
  } catch (error) {
    throw error;
  }
}

export async function fetchMatchHistory() {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/match-history`)
  if (!response.ok) throw new Error('Failed to fetch match history')
  return response.json()
}

export async function fetchMatchHistoryByRiotId(gameName: string, tagLine: string, count: number = 10, region: string = 'europe') {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/match-history?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}&count=${count}&region=${region}`;
  
  try {
    console.log(`Fetching match history for ${gameName}#${tagLine}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      // Nếu có fallback data, sử dụng nó
      if (errorData && errorData.fallback) {
        console.warn(`Using fallback data due to API error: ${errorData.message}`);
        return errorData.fallback;
      }
      throw new Error(`Failed to fetch match history: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error in fetchMatchHistoryByRiotId:`, error);
    throw error;
  }
}

export interface PCComponent {
  _id: string;
  name: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string[];
  isPublic: boolean;
  user: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  components?: Array<{
    component?: any;
    quantity?: number;
  }>;
}

export interface PCComponentsResponse {
  data: {
    builds: PCComponent[];
  }
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchPCComponents(page: number = 1, limit: number = 20): Promise<PCComponentsResponse> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/pc-components?page=${page}&limit=${limit}`)
  if (!response.ok) throw new Error('Failed to fetch PC components')
  return response.json()
}

export async function fetchPCComponentById(id: string): Promise<PCComponent> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/pc-components/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch PC component: ${id}`);
    return response.json();
  } catch (error) {
    throw error;
  }
}

export async function fetchMostPicked() {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/most-picked`)
  if (!response.ok) throw new Error('Failed to fetch most picked champions')
  return response.json()
}

// Comments interface
export interface Comment {
  _id: string;
  pcBuildId: string | null;
  newsId: string | null;
  authorName: string;
  content: string;
  userId?: string;
  createdAt: string;
  isApproved: boolean;
}

export interface CommentsResponse {
  data: {
    comments: Comment[];
  }
}

export async function fetchPCBuildComments(pcBuildId: string): Promise<CommentsResponse> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/comments/pc-build/${pcBuildId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch comments for PC build: ${pcBuildId}`);
    return response.json();
  } catch (error) {
    throw error;
  }
}

export interface CommentResponse {
  data: Comment;
}

export async function createPCBuildComment(pcBuildId: string, comment: { authorName: string; content: string }): Promise<Comment> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/comments/pc-build/${pcBuildId}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    });
    
    if (!response.ok) throw new Error(`Failed to post comment for PC build: ${pcBuildId}`);
    const result = await response.json();
    // Return the comment data, which may be in result.data or directly in result
    return result.data || result;
  } catch (error) {
    throw error;
  }
}

export async function fetchNewsComments(newsId: string): Promise<CommentsResponse> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/comments/news/${newsId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch comments for news article: ${newsId}`);
    return response.json();
  } catch (error) {
    throw error;
  }
}

export async function createNewsComment(newsId: string, comment: { authorName: string; content: string }): Promise<Comment> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/comments/news/${newsId}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    });
    
    if (!response.ok) throw new Error(`Failed to post comment for news article: ${newsId}`);
    const result = await response.json();
    // Return the comment data, which may be in result.data or directly in result
    return result.data || result;
  } catch (error) {
    throw error;
  }
}

// Champion interface matching the Data Dragon API
export interface ChampionData {
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  tags: string[];
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  partype: string;
  stats: {
    hp: number;
    hpperlevel: number;
    mp: number;
    mpperlevel: number;
    movespeed: number;
    armor: number;
    armorperlevel: number;
    spellblock: number;
    spellblockperlevel: number;
    attackrange: number;
    hpregen: number;
    hpregenperlevel: number;
    mpregen: number;
    mpregenperlevel: number;
    crit: number;
    critperlevel: number;
    attackdamage: number;
    attackdamageperlevel: number;
    attackspeedperlevel: number;
    attackspeed: number;
  };
}

export interface ChampionsResponse {
  data: {
    champions: ChampionData[];
  };
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ChampionDetailResponse {
  data: ChampionData;
}

export async function fetchChampionsLol(page: number = 1, limit: number = 20, search: string = ''): Promise<ChampionsResponse> {
  const baseUrl = getBaseUrl();
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (search) {
    queryParams.append('search', search);
  }
  
  const response = await fetch(`${baseUrl}/api/champions/lol?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch LoL champions');
  return response.json();
}

export async function fetchChampionLolById(id: string): Promise<ChampionDetailResponse> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/champions/lol/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch LoL champion: ${id}`);
    return response.json();
  } catch (error) {
    throw error;
  }
}

export async function fetchRunes() {
  try {
    const response = await fetch('https://ddragon.leagueoflegends.com/cdn/15.9.1/data/vi_VN/runesReforged.json');
    if (!response.ok) throw new Error('Failed to fetch runes data');
    return response.json();
  } catch (error) {
    console.error('Error fetching runes:', error);
    throw error;
  }
}

export async function fetchSummonerSpells() {
  try {
    const response = await fetch('https://ddragon.leagueoflegends.com/cdn/15.9.1/data/vi_VN/summoner.json');
    if (!response.ok) throw new Error('Failed to fetch summoner spells data');
    return response.json();
  } catch (error) {
    console.error('Error fetching summoner spells:', error);
    throw error;
  }
}