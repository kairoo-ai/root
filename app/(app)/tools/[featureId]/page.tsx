import { notFound } from 'next/navigation'
import { features } from '@/engines/ai/features/registry'
import { ToolPageClient } from './_components/ToolPageClient'

interface Props {
  params: Promise<{ featureId: string }>
}

export default async function ToolPage({ params }: Props) {
  const { featureId } = await params
  const feature = features.find(f => f.id === featureId)
  if (!feature) notFound()

  // Omit functions to prevent React 19 / Next 16 prerender error
  const { buildUserPrompt, systemAddendum, ...clientFeature } = feature
  return <ToolPageClient feature={clientFeature} />
}

export async function generateStaticParams() {
  return features.map(f => ({ featureId: f.id }))
}
