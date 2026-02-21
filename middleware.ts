import { NextResponse, NextRequest } from 'next/server';

// Simplified middleware to avoid TypeScript errors
export function middleware(request: NextRequest) {
  // Handle OPTIONS requests for CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
        'Access-Control-Max-Age': '86400', // 24 hours
      },
    });
  }

  // For non-OPTIONS requests, add CORS headers to the response
  const response = NextResponse.next();
  
  // Add CORS headers to all responses
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  
  return response;
}

// Limit middleware to specific paths to avoid errors
export const config = {
  matcher: [
    // Only apply to the root path and API routes
    '/',
    '/api/:path*',
    '/upload'
  ],
};

