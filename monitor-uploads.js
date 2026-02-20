/**
 * The 6-Second Test™ - Upload Monitor
 * 
 * This script helps you monitor for new uploads in your Supabase bucket
 * during the manual beta phase. It lists all files in the "resumes" bucket
 * and can be run periodically to check for new uploads.
 * 
 * Usage:
 * 1. Update the SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY variables
 * 2. Run with Node.js: node monitor-uploads.js
 */

const { createClient } = require('@supabase/supabase-js');

// Update these with your actual Supabase credentials
// The URL should be in the format: https://your-project-id.supabase.co
// NOT the dashboard URL (https://supabase.com/dashboard/project/...)
const SUPABASE_URL = process.env.SUPABASE_URL || 'your-project-id.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

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
 * List all files in the "resumes" bucket
 */
async function listFiles() {
  try {
    console.log(`${colors.blue}Connecting to Supabase...${colors.reset}`);
    
    // List all files in the "resumes" bucket
    const { data, error } = await supabase
      .storage
      .from('resumes')
      .list();
    
    if (error) {
      console.error(`${colors.red}Error listing files:${colors.reset}`, error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log(`${colors.yellow}No files found in the "resumes" bucket.${colors.reset}`);
      return;
    }
    
    console.log(`${colors.green}Found ${data.length} files in the "resumes" bucket:${colors.reset}`);
    console.log('');
    
    // Sort files by created_at (newest first)
    data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Display files in a table format
    console.log(`${colors.cyan}ID                                      | Size       | Created At${colors.reset}`);
    console.log(`${colors.cyan}----------------------------------------|------------|-------------------${colors.reset}`);
    
    data.forEach(file => {
      const fileId = file.id || file.name;
      const size = formatFileSize(file.metadata?.size || 0);
      const createdAt = new Date(file.created_at).toLocaleString();
      
      console.log(`${fileId.padEnd(40)} | ${size.padEnd(10)} | ${createdAt}`);
    });
    
    console.log('');
    console.log(`${colors.green}To download a file, use the Supabase dashboard or run:${colors.reset}`);
    console.log(`node -e "require('./download-resume.js').downloadResume('FILE_ID')"`);
    
  } catch (error) {
    console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
  }
}

/**
 * Format file size in a human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run the script
listFiles().catch(console.error);