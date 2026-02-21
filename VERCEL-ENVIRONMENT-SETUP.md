# Setting Up Environment Variables in Vercel

The error message `{"error":"Missing STRIPE_SECRET_KEY, STRIPE_PRICE_ID, or NEXT_PUBLIC_BASE_URL"}` indicates that your Vercel deployment doesn't have the necessary environment variables configured. Here's how to set them up:

## Step 1: Access Your Vercel Project Settings

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (six-second-test)
3. Click on the "Settings" tab in the top navigation

## Step 2: Add Environment Variables

1. In the left sidebar, click on "Environment Variables"
2. Add each of the following variables one by one:

### Stripe Configuration
```
Name: STRIPE_SECRET_KEY
Value:
Environment: Production, Preview, Development
```

```
Name: STRIPE_PRICE_ID
Value: YOUR_STRIPE_PRICE_ID_HERE
Environment: Production, Preview, Development
```

### Base URL
```
Name: NEXT_PUBLIC_BASE_URL
Value: https://six-second-test.com (or your actual domain)
Environment: Production, Preview, Development
```

### Supabase Configuration
```
Name: SUPABASE_URL
Value: YOUR_SUPABASE_URL_HERE
Environment: Production, Preview, Development
```

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value:
Environment: Production, Preview, Development
```

## Step 3: Redeploy Your Application

After adding all the environment variables:

1. Go to the "Deployments" tab
2. Find your latest deployment
3. Click the three dots menu (⋮) next to it
4. Select "Redeploy" from the dropdown menu

## Step 4: Verify the Changes

1. Wait for the deployment to complete
2. Visit your site and test the "Run the 6-Second Test" button again
3. The checkout process should now work correctly

## Important Security Notes

1. **Stripe Keys**: For production, you should use live Stripe keys instead of test keys.
2. **Supabase Keys**: The service role key has full access to your database. Keep it secure.
3. **Environment Separation**: For a more secure setup, consider using different values for Production vs. Development environments.

## Step 5: Create the Supabase "resumes" Bucket

After setting up the environment variables and redeploying, you need to create the required storage bucket in Supabase:

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to "Storage" in the left sidebar
4. Click "New Bucket"
5. Enter "resumes" as the bucket name
6. Uncheck "Public bucket" to make it private
7. Click "Create bucket"

This step is crucial because the upload functionality requires this bucket to exist in your Supabase project.

## Troubleshooting

If you still encounter issues after setting up the environment variables and creating the bucket:

1. Check the Vercel deployment logs for any errors
2. Verify that the environment variables are correctly set without any typos
3. Make sure the NEXT_PUBLIC_BASE_URL matches your actual domain
4. Confirm that the "resumes" bucket exists in your Supabase project
5. Check Supabase bucket permissions:
   - Go to your Supabase dashboard
   - Navigate to Storage > Policies
   - Make sure the "resumes" bucket has appropriate policies
   - If needed, add a policy to allow uploads with the service role key
6. Verify Stripe session handling:
   - Make sure the Stripe checkout process completes successfully
   - Check that the session ID is being passed correctly to the upload page
7. Try clearing your browser cache or testing in an incognito window
8. Check browser console for any JavaScript errors
9. Verify that your Supabase service role key has the necessary permissions

## Fixing "Method Not Allowed" Error

If you encounter a "Method Not Allowed" error when uploading a resume, this is likely due to how Vercel is handling the API routes. We've implemented three complementary fixes:

### 1. Updated vercel.json with Explicit Route Configurations

```json
{
  "routes": [
    {
      "src": "/api/upload",
      "methods": ["POST", "OPTIONS"],
      "dest": "/api/upload"
    },
    {
      "src": "/api/checkout",
      "methods": ["POST", "OPTIONS"],
      "dest": "/api/checkout"
    }
  ]
}
```

This configuration explicitly tells Vercel to allow POST and OPTIONS methods for these API routes.

### 2. Added OPTIONS Request Handlers to API Routes

We've also added explicit OPTIONS request handlers to both API routes:

```typescript
// Handle OPTIONS requests for CORS
export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

### 3. Enhanced Middleware with Comprehensive CORS Support

As an additional layer of protection, we've updated the middleware to properly handle CORS:

```typescript
export function middleware(request: NextRequest) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Add CORS headers to all responses
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}
```

This triple approach ensures that your API routes properly handle CORS preflight requests at multiple levels and should resolve the "Method Not Allowed" error. After deploying these changes, the upload functionality should work correctly.

## Advanced Troubleshooting

If the issue persists, you can try these additional steps:

1. **Enable detailed logging in Vercel:**
   - Go to your Vercel project settings
   - Navigate to the "Functions" tab
   - Enable "Debug" mode for more detailed logs

2. **Test the API endpoints directly:**
   - Use a tool like Postman to test the `/api/upload` endpoint
   - This can help identify if the issue is with the frontend or backend

3. **Check for CORS issues:**
   - If you're using a custom domain, ensure CORS is properly configured
   - Supabase may require additional configuration for cross-origin requests