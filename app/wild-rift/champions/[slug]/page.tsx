import ChampionPageClient from './champion-page-client'

export function generateStaticParams() {
  return [
    { slug: 'ahri' },
    { slug: 'yasuo' },
    { slug: 'lee-sin' },
    { slug: 'lux' }
  ]
}

export default function ChampionPage({ params }: { params: { slug: string } }) {
  return <ChampionPageClient slug={params.slug} />
}