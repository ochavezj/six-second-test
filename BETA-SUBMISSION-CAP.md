# Beta Submission Cap Implementation

This document explains how the beta submission cap is implemented in "The 6-Second Test™" application.

## Overview

To limit the number of submissions during the beta phase to 50, we've implemented a counter system using Supabase. This system:

1. Tracks the total number of submissions
2. Prevents new checkout sessions when the limit is reached
3. Shows the remaining slots on the homepage
4. Displays a message when all slots are filled

## Implementation Details

### 1. Database Structure

We use a simple table in Supabase to track submissions:

```sql
CREATE TABLE public.submissions_count (
  id INTEGER PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
);
```

This table contains a single row with:
- `id` = 1 (fixed value)
- `count` = current number of submissions

### 2. SQL Functions

Three SQL functions manage the submission counter:

1. `create_submissions_table()`: Creates the table if it doesn't exist
2. `increment_submission_count()`: Increments the counter when a submission is received
3. `get_submission_count()`: Retrieves the current count

These functions are defined in the `setup-submission-counter.sql` file and should be executed in the Supabase SQL Editor.

### 3. API Integration

The submission cap is enforced at two points:

#### Checkout API (`/api/checkout/route.ts`)

Before creating a Stripe checkout session, the API checks if the limit has been reached:

```typescript
// Check if we've reached the beta submission limit
const { data: countData } = await supabase
  .from('submissions_count')
  .select('count')
  .eq('id', 1)
  .single();

const currentCount = countData?.count || 0;

// Check if we've reached the limit
if (currentCount >= BETA_SUBMISSION_LIMIT) {
  return NextResponse.json(
    { 
      error: "Beta submission limit reached", 
      message: "We've reached our beta testing limit of 50 submissions."
    },
    { status: 403 }
  );
}
```

#### Upload API (`/api/upload/route.ts`)

After a successful upload, the counter is incremented:

```typescript
// Increment the submission counter
const { error: incrementError } = await supabase.rpc('increment_submission_count');
```

### 4. Frontend Display

The homepage (`app/page.tsx`) fetches the current submission count and displays:

- The number of remaining slots
- A disabled button when the limit is reached
- A notification message explaining the limit

## Setup Instructions

1. Run the SQL script in the Supabase SQL Editor:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `setup-submission-counter.sql`
   - Run the script

2. Ensure the environment variables are set:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Adjusting the Limit

To change the submission limit:

1. Update the `BETA_SUBMISSION_LIMIT` constant in:
   - `app/api/checkout/route.ts`
   - `app/api/submission-count/route.ts`

## Resetting the Counter

To reset the counter (for testing or after the beta phase):

```sql
UPDATE public.submissions_count
SET count = 0
WHERE id = 1;
```

Run this SQL command in the Supabase SQL Editor.