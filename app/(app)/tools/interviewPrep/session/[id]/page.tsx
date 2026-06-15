import { auth } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import { getSessionWithExchanges } from '@/data/repositories/interview.repo'
import { SessionClient } from './_SessionClient'

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { id } = await params
  const session = await getSessionWithExchanges(id, userId)
  if (!session) notFound()

  if (session.status === 'completed') {
    redirect(`/tools/interviewPrep/session/${id}/results`)
  }

  return <SessionClient session={session} />
}
