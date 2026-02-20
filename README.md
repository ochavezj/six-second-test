# The 6-Second Test™

A lightweight web product that simulates a recruiter's first-pass resume skim and provides clear, actionable feedback to help job seekers improve clarity, credibility, and impact.

## Overview

The 6-Second Test™ is a focused clarity diagnostic tool that helps job seekers understand how recruiters view their resumes in the initial screening phase. It provides actionable feedback on three core dimensions:

1. **Credibility Alignment** - Does the level of responsibility align with the level of impact claimed?
2. **Impact Compression** - Can a recruiter quickly see the value this person created?
3. **Outcome Clarity** - What changed because of this person?

## Features

- Simple payment flow via Stripe
- Secure resume upload (PDF only)
- Private storage in Supabase
- Detailed report delivered within 24 hours

## Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS
- **Payments**: Stripe Checkout Sessions
- **Storage**: Supabase Storage (private bucket)

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Stripe account
- Supabase account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# IMPORTANT: Use the project URL format, NOT the dashboard URL
# Correct format: https://your-project-id.supabase.co
# NOT: https://supabase.com/dashboard/project/your-project-id
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Important Note for Testing:**
For local development and testing, you'll need to:
1. Create a Stripe account and get your test API keys
2. Create a Supabase project and set up a private storage bucket named "resumes"
3. Restart the development server after updating environment variables

If you're just testing the UI flow without actual API integration, you can use placeholder values in your `.env.local` file, but the upload functionality will not work without valid credentials.

### Supabase Setup

1. Create a new Supabase project
2. Create a storage bucket named `resumes` with private access
3. Get your Supabase URL and service role key from the project settings

### Stripe Setup

1. Create a product in your Stripe dashboard
2. Set the price to $29 (or your preferred amount)
3. Get the price ID and your Stripe secret key

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## User Flow

1. User lands on the homepage
2. Clicks "Run the 6-Second Test"
3. Pays $29 via Stripe Checkout
4. Is redirected to the upload page
5. Uploads resume PDF and enters email
6. Receives confirmation
7. Report is delivered within 24 hours (manual beta phase)

## Project Structure

- `app/page.tsx` - Landing page
- `app/upload/page.tsx` - Resume upload page
- `app/api/checkout/route.ts` - Stripe checkout API endpoint
- `app/api/upload/route.ts` - Resume upload API endpoint

## Development Phases

### Phase 1: Manual Beta (Current)

- Intake working
- Storage working
- Manual report generation
- Cap at 50 users

### Phase 2: Partial Automation

- Extract PDF text
- Run AI evaluation server-side
- Generate report automatically

### Phase 3: Fully Automated Delivery

- Email report automatically
- Add analytics
- Optional testimonials page

## License

Proprietary - All rights reserved
