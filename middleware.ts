import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/pricing',
  '/features(.*)',
  '/how-it-works',
  '/customers',
  '/about',
  '/contact',
  '/security',
  '/careers',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/investors(.*)',
  '/privacy',
  '/terms',
  '/cookies',
  '/acceptable-use',
  '/ai-disclosure',
  '/dpa',
  '/sub-processors',
  '/legal(.*)',
  '/style(.*)',
  '/sitemap.xml',
  '/robots.txt',
  '/opengraph-image',
  '/manifest.webmanifest',
  '/llms.txt',
  '/humans.txt',
  '/.well-known(.*)',
])

const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)',
    '/(api|trpc)(.*)',
  ],
}
