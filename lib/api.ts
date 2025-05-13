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
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: {
    name: string;
    image?: string;
  };
  date: string;
  readTime?: string;
}

export interface NewsResponse {
  data: NewsArticle[];
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

export interface PCComponent {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  price?: number;
  specifications?: Record<string, string>;
  rating?: number;
  author: {
    name: string;
    image?: string;
  };
  date: string;
}

export interface PCComponentsResponse {
  data: PCComponent[];
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