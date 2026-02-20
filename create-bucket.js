/**
 * The 6-Second Test™ - Create Supabase Bucket
 * 
 * This script creates the "resumes" bucket in your Supabase project.
 * Run this script once to set up the required storage bucket.
 * 
 * Usage:
 * 1. Make sure your Supabase URL and service role key are correct in .env.local
 * 2. Run with Node.js: node create-bucket.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Get Supabase credentials from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
  console.error('Make sure you have set these variables in your .env.local file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Create the "resumes" bucket in Supabase
 */
async function createBucket() {
  try {
    console.log(`${colors.blue}Creating "resumes" bucket in Supabase...${colors.reset}`);
    
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error(`${colors.red}Error listing buckets: ${listError.message}${colors.reset}`);
      return;
    }
    
    const resumesBucket = buckets.find(bucket => bucket.name === 'resumes');
    
    if (resumesBucket) {
      console.log(`${colors.yellow}Bucket "resumes" already exists.${colors.reset}`);
      
      // Update bucket to be private
      const { error: updateError } = await supabase.storage.updateBucket('resumes', {
        public: false,
      });
      
      if (updateError) {
        console.error(`${colors.red}Error updating bucket: ${updateError.message}${colors.reset}`);
        return;
      }
      
      console.log(`${colors.green}Bucket "resumes" updated to be private.${colors.reset}`);
      return;
    }
    
    // Create the bucket
    const { error: createError } = await supabase.storage.createBucket('resumes', {
      public: false, // Make it private
    });
    
    if (createError) {
      console.error(`${colors.red}Error creating bucket: ${createError.message}${colors.reset}`);
      return;
    }
    
    console.log(`${colors.green}Bucket "resumes" created successfully!${colors.reset}`);
    console.log(`${colors.cyan}The bucket is set to private, which means files can only be accessed with the service role key.${colors.reset}`);
    
  } catch (err) {
    console.error(`${colors.red}Unexpected error: ${err.message}${colors.reset}`);
  }
}

// Run the function
createBucket().catch(console.error);