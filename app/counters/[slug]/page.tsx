import CounterDetailClient from './counter-detail-client'

// Add generateStaticParams function for static page generation
export function generateStaticParams() {
  return [
    { slug: 'briar' },
    { slug: 'ahri' },
    { slug: 'yasuo' },
    { slug: 'zed' },
    { slug: 'lux' },
    { slug: 'jinx' },
    { slug: 'leona' },
    { slug: 'thresh' },
    { slug: 'lee-sin' },
    { slug: 'darius' },
    { slug: 'katarina' }
  ]
}

export default function CounterPage({ params }: { params: { slug: string } }) {
  return <CounterDetailClient slug={params.slug} />
}