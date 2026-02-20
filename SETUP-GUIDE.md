# The 6-Second Test™ - Setup Guide

This guide will walk you through the steps needed to get the application fully functional.

## Step 1: Update Environment Variables

1. Open the `.env.local` file in the root directory
2. Replace the placeholder values with your actual credentials:

```
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key
STRIPE_PRICE_ID=price_your_actual_stripe_price_id

# Base URL (use localhost for development)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Supabase Configuration
# IMPORTANT: Use the project URL format, NOT the dashboard URL
# Correct format: https://your-project-id.supabase.co
# NOT: https://supabase.com/dashboard/project/your-project-id
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_actual_supabase_service_role_key
```

## Step 2: Create Supabase Storage Bucket

1. Install dotenv if you haven't already:
```bash
npm install dotenv
```

2. Run the provided script to create the "resumes" bucket:
```bash
node create-bucket.js
```

This script will create a private storage bucket named "resumes" in your Supabase project, which is required for file uploads to work.

## Step 3: Restart the Development Server

1. Stop the current development server (if running) by pressing `Ctrl+C` in the terminal
2. Start it again with:

```bash
npm run dev
```

## Step 4: Test the Complete Flow

1. Open http://localhost:3000 in your browser
2. Click "Run the 6-Second Test"
3. Complete the Stripe checkout using a test card:
   - Card number: 4242 4242 4242 4242
   - Any future expiration date
   - Any 3-digit CVC
   - Any name and postal code
4. You should be redirected to the upload page
5. Enter your email and upload a PDF resume
6. Click "Submit Resume"
7. You should see a success message

## Step 5: Verify File Upload

1. Log in to your Supabase dashboard
2. Go to Storage → Buckets → resumes
3. Verify that the uploaded file is there with a name format like: `2026-02-20T04-07-57-583Z__your_email__session_id.pdf`

## Step 6: Manual Report Generation (Beta Phase)

For the beta phase, you'll need to:

1. Regularly check your Supabase storage for new uploads
2. Download the PDF files
3. Review the resumes manually according to the evaluation framework:
   - Credibility Alignment
   - Impact Compression
   - Outcome Clarity
4. Create a report with:
   - Recruiter Readiness Score (0-100)
   - Quick Verdict (2-3 sentences)
   - Section-by-Section Review
   - Top 3 High-Leverage Fixes
   - One Rewritten Bullet Example
5. Send the report to the user's email within 24 hours

## Step 7: Prepare for Production (When Ready)

When you're ready to deploy to production:

1. Update the `.env` file on your production server with the same variables
2. Change `NEXT_PUBLIC_BASE_URL` to your production URL (e.g., https://six-second-test.com)
3. Consider using environment variables management in your hosting platform (Vercel, Netlify, etc.)
4. Make sure your Stripe webhook endpoints are updated if you're using them

## Troubleshooting

If you encounter issues:

1. **Upload fails**: Check Supabase credentials and bucket permissions
2. **Stripe checkout fails**: Verify Stripe API keys and price ID
3. **Redirect issues**: Ensure NEXT_PUBLIC_BASE_URL is set correctly
4. **Server errors**: Check the terminal output for detailed error messages

## Next Steps for Phase 2

As outlined in the product brief, the next phase would involve:

1. Extracting PDF text programmatically
2. Running AI evaluation server-side
3. Generating the report automatically
4. Setting up automated email delivery