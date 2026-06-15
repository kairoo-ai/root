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

  const clientFeature = {
    id: feature.id,
    name: feature.name,
    icon: feature.icon,
    color: feature.color,
    description: feature.description,
    category: feature.category,
    status: feature.status,
    inputs: feature.inputs,
    tier: feature.tier,
  }
  return <ToolPageClient feature={clientFeature} />
}

export async function generateStaticParams() {
  return features.map(f => ({ featureId: f.id }))
}
