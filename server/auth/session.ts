import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function requireUser() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  return userId
}

export async function requireUserFull() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')
  return user
}

export async function getOptionalUser() {
  const { userId } = await auth()
  return userId
}
