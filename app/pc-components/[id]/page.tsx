import PCComponentDetailClient from './components/pc-component-detail-client'

type Props = {
  params: { id: string }
}

export default function PCComponentDetailPage({ params }: Props) {
  return <PCComponentDetailClient id={params.id} />
}