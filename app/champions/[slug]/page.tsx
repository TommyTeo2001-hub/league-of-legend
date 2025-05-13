import { fetchChampions } from '@/lib/api'
import ChampionPageClient from './champion-page-client'

// Hàm này chạy trên server tại thời điểm build
export async function generateStaticParams() {
  try {
    const champions = await fetchChampions('league');
    return champions.map((champion: any) => ({
      slug: champion.id
    }));
  } catch (error) {
    // Fallback nếu không lấy được danh sách
    return [
      { slug: 'ahri' },
      { slug: 'yasuo' },
      { slug: 'taric' },
      { slug: 'gnar' }
    ];
  }
}

// Đây là server component không có "use client"
export default function ChampionPage({ params }: { params: { slug: string } }) {
  // Truyền params vào client component
  return <ChampionPageClient slug={params.slug} />;
}