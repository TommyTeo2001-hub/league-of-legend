import { fetchChampionsLol } from '@/lib/api'
import ChampionPageClient from './champion-page-client'

// Hàm này chạy trên server tại thời điểm build
export async function generateStaticParams() {
  try {
    const response = await fetchChampionsLol();
    if (response && response.data && response.data.champions) {
      return response.data.champions.map((champion) => ({
        slug: champion.id
      }));
    }
    throw new Error('No champions data returned');
  } catch (error) {
    // Fallback nếu không lấy được danh sách
    console.error('Error generating static params for champions:', error);
    return [
      { slug: 'aatrox' },
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