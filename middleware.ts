import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Simply pass through all requests
  return NextResponse.next();
}

// Limit middleware to specific paths to avoid errors
export const config = {
  matcher: [
    // Only apply to the root path and API routes
    '/',
    '/api/:path*'
  ],
};