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
Value: YOUR_STRIPE_SECRET_KEY_HERE
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
Value: YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE
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

## Troubleshooting

If you still encounter issues after setting up the environment variables:

1. Check the Vercel deployment logs for any errors
2. Verify that the environment variables are correctly set without any typos
3. Make sure the NEXT_PUBLIC_BASE_URL matches your actual domain
4. Try clearing your browser cache or testing in an incognito window