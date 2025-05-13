import NewsArticleDetail from './components/news-article-detail'

type Props = {
  params: { id: string }
}

export default function NewsDetailPage({ params }: Props) {
  return <NewsArticleDetail id={params.id} />
}