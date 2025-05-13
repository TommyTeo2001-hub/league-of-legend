import { fetchChampionById } from '@/lib/api'
import ChampionDetails from './champion-details'

export function generateStaticParams() {
  return [
    { slug: 'gnar' },
    { slug: 'lucian' },
    { slug: 'miss-fortune' }
  ]
}

async function getChampionData(slug: string) {
  return fetchChampionById('tft', slug)
}

export default async function ChampionPage({ params }: { params: { slug: string } }) {
  const championData = await getChampionData(params.slug)
  return <ChampionDetails championData={championData} />
}