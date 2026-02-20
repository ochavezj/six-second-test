# Six-Second Test - Site Testing Guide

Use this guide to verify that your site is functioning correctly on your custom domain after implementing the fixes for the Vercel NOT_FOUND error.

## 1. Basic Page Loading Tests

### Landing Page
- Visit `https://six-second-test.com` (replace with your actual domain)
- Verify that the landing page loads completely with all UI elements
- Check that the profile image displays correctly
- Confirm that all styling and animations work as expected

### Direct Access to Upload Page
- Try accessing `https://six-second-test.com/upload` directly
- You should either be redirected to the home page or see a message about needing to complete payment first
- This verifies that protected routes are working correctly

## 2. API Endpoint Tests

### Checkout API
- On the landing page, click the "Run the 6-Second Test" button
- This should trigger a call to the `/api/checkout` endpoint
- Verify that you're redirected to the Stripe checkout page
- If this works, your checkout API endpoint is configured correctly

### Upload API
- After completing a test payment with Stripe's test card (4242 4242 4242 4242)
- You should be redirected to the upload page with a session ID in the URL
- Try uploading a test PDF file
- If the upload succeeds, your upload API endpoint is working correctly

## 3. Environment Variable Tests

- Check the browser console for any errors related to undefined environment variables
- Look for messages like "BASE URL =" in your server logs (in Vercel dashboard)
- Verify that the URLs in success/cancel redirects use your custom domain, not localhost

## 4. Error Handling Tests

- Try uploading an invalid file format (not PDF)
- Try submitting the upload form without an email
- Try accessing the upload page with an invalid session ID
- All of these should show appropriate error messages, not 404 or 500 errors

## 5. Console and Network Monitoring

- Open your browser's developer tools
- Monitor the Network tab for any failed requests (red items)
- Check the Console tab for any JavaScript errors
- Look for middleware logs ("Middleware processing:" messages)

## 6. Vercel Dashboard Checks

If you encounter any issues, check these in your Vercel dashboard:

1. **Deployment Status**:
   - Verify the latest deployment shows as "Complete" with a green checkmark

2. **Function Logs**:
   - Go to Deployments > Latest Deployment > Functions
   - Check logs for your API routes

3. **Environment Variables**:
   - Confirm all environment variables are set correctly
   - Especially check NEXT_PUBLIC_BASE_URL is set to your custom domain

4. **Domain Settings**:
   - Verify your domain shows as "Valid Configuration" with a green checkmark
   - Check that DNS settings are correct

## 7. DNS Verification

If your site still doesn't load properly:

1. Run a DNS lookup:
   ```
   dig six-second-test.com
   ```

2. Verify it points to Vercel's IP: `76.76.21.21`

3. Check DNS propagation using a tool like [whatsmydns.net](https://www.whatsmydns.net/)

## 8. Complete User Flow Test

Once individual components are working, test the complete user flow:

1. Visit the landing page
2. Click "Run the 6-Second Test"
3. Complete the Stripe checkout with test card
4. Upload a PDF on the upload page
5. Verify you receive the success confirmation

## Troubleshooting Common Issues

### If Landing Page Works But API Calls Fail:
- API routes may not be properly configured
- Check that `dynamic = "force-dynamic"` and `revalidate = 0` are set in route.ts files
- Verify the middleware is logging requests

### If You See CORS Errors:
- Your browser may be blocking cross-origin requests
- Check that all URLs in API calls use the same domain

### If You See 404 Errors:
- Routes may not be properly defined in vercel.json
- Check that the rewrites in next.config.ts are correct

### If You See Environment Variable Errors:
- Environment variables may not be set in Vercel
- Check that they're defined in both vercel.json and the Vercel dashboard

## Next Steps After Successful Testing

Once you've verified that everything is working correctly:

1. Update the todo list to mark "Test site functionality on custom domain" as completed
2. Consider implementing the Phase 2 automation features outlined in the deployment guide
3. Set up monitoring for your production site
4. Begin your manual beta phase with up to 50 users