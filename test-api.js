/**
 * The 6-Second Test™ - API Test Script
 * 
 * This script tests the API endpoints for the 6-Second Test application.
 * It can be run with Node.js to verify that the API endpoints are working correctly.
 * 
 * Usage:
 * 1. Make sure the development server is running
 * 2. Run this script with Node.js: node test-api.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_EMAIL = 'test@example.com';
const TEST_PDF_PATH = path.join(__dirname, 'test-resume.pdf'); // Create a test PDF file

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
 * Make an HTTP request
 * @param {string} url - The URL to request
 * @param {string} method - The HTTP method
 * @param {Object} headers - The request headers
 * @param {string|Buffer} body - The request body
 * @returns {Promise<Object>} - The response object
 */
function makeRequest(url, method = 'GET', headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: `${urlObj.pathname}${urlObj.search}`,
      method: method,
      headers: headers,
    };

    const req = (urlObj.protocol === 'https:' ? https : http).request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        let responseBody;
        try {
          responseBody = data ? JSON.parse(data) : {};
        } catch (e) {
          responseBody = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseBody,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

/**
 * Log a message to the console
 * @param {string} message - The message to log
 * @param {string} type - The type of message (info, success, error, warning)
 */
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  let color = colors.reset;
  let prefix = '';

  switch (type) {
    case 'success':
      color = colors.green;
      prefix = '✓ SUCCESS: ';
      break;
    case 'error':
      color = colors.red;
      prefix = '✗ ERROR: ';
      break;
    case 'warning':
      color = colors.yellow;
      prefix = '⚠ WARNING: ';
      break;
    case 'info':
    default:
      color = colors.blue;
      prefix = 'ℹ INFO: ';
      break;
  }

  console.log(`${color}[${timestamp}] ${prefix}${message}${colors.reset}`);
}

/**
 * Test the Stripe checkout endpoint
 */
async function testCheckoutEndpoint() {
  log('Testing Stripe checkout endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/checkout`, 'POST');
    
    if (response.statusCode === 303) {
      log('Checkout endpoint returned redirect as expected', 'success');
      return true;
    } else {
      log(`Unexpected status code: ${response.statusCode}`, 'error');
      console.log(response.body);
      return false;
    }
  } catch (error) {
    log(`Error testing checkout endpoint: ${error.message}`, 'error');
    return false;
  }
}

/**
 * Test the upload endpoint with invalid data
 */
async function testUploadEndpointValidation() {
  log('Testing upload endpoint validation...');
  
  // Test missing session_id
  try {
    const formData = new FormData();
    formData.append('email', TEST_EMAIL);
    
    const response = await makeRequest(`${BASE_URL}/api/upload`, 'POST', {}, JSON.stringify({
      email: TEST_EMAIL
    }));
    
    if (response.statusCode === 400 && response.body.error) {
      log('Upload endpoint correctly rejected missing session_id', 'success');
      return true;
    } else {
      log('Upload endpoint should reject missing session_id', 'error');
      console.log(response);
      return false;
    }
  } catch (error) {
    log(`Error testing upload endpoint validation: ${error.message}`, 'error');
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  log('Starting API tests for The 6-Second Test™', 'info');
  
  const checkoutTest = await testCheckoutEndpoint();
  const validationTest = await testUploadEndpointValidation();
  
  if (checkoutTest && validationTest) {
    log('All API tests passed!', 'success');
  } else {
    log('Some tests failed. See above for details.', 'warning');
  }
}

// Run the tests
runTests().catch(error => {
  log(`Unhandled error: ${error.message}`, 'error');
  console.error(error);
});