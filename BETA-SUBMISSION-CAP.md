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
