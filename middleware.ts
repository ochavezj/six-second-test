import { NextResponse, NextRequest } from 'next/server';

// Simplified middleware to avoid TypeScript errors
export function middleware(request: NextRequest) {
  // Simply pass through all requests with CORS headers
  const response = NextResponse.next();
  
  // Add CORS headers to all responses
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

// Limit middleware to specific paths to avoid errors
export const config = {
  matcher: [
    // Only apply to the root path and API routes
    '/',
    '/api/:path*'
  ],
};




