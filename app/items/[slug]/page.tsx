import ItemDetailClient from './item-detail-client'

// Add the required generateStaticParams function
export function generateStaticParams() {
  return [
    { slug: 'infinity-edge' },
    { slug: 'bloodthirster' },
    { slug: 'b-f-sword' },
    { slug: 'pickaxe' },
    { slug: 'cloak-of-agility' }
  ]
}

export default function ItemDetailPage({ params }: { params: { slug: string } }) {
  return <ItemDetailClient slug={params.slug} />
}