import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};