# The 6-Second Test™ - Test Flow

## Test Environment
- Local development server running on http://localhost:3000
- Test date: 2026-02-20

## Test Cases

### 1. Landing Page
- [x] Page loads correctly
- [x] All content is visible and properly formatted
- [x] "Run the 6-Second Test" button is present
- [x] Pricing information is displayed ($29)

### 2. Stripe Checkout
- [x] Clicking "Run the 6-Second Test" redirects to Stripe Checkout
- [x] Stripe Checkout shows the correct product and price ($29)
- [x] Test payment can be completed with test card (4242 4242 4242 4242)
- [x] After payment, user is redirected to upload page with session_id parameter

### 3. Upload Page
- [x] Page loads correctly with valid session_id
- [x] Email input field is present and validates input
- [x] File upload field is present and accepts PDF files
- [x] Submit button is present and enabled

### 4. Form Validation
- [x] Form prevents submission without email
- [x] Form prevents submission with invalid email format
- [x] Form prevents submission without file
- [x] Form prevents submission with non-PDF file
- [x] Form prevents submission with file > 10MB

### 5. Upload API
- [x] API accepts valid form data
- [x] API validates session_id with Stripe
- [x] API validates file type and size
- [x] API uploads file to Supabase storage
- [x] API returns success response with storage path

### 6. Error Handling
- [x] Direct access to upload page without session_id shows error
- [x] Invalid session_id shows appropriate error
- [x] API returns appropriate error messages for validation failures
- [x] Frontend displays error messages to user

### 7. Success Flow
- [x] After successful upload, success message is displayed
- [x] Success message indicates report will be delivered within 24 hours

## Test Results

All test cases passed successfully. The application is working as expected and ready for the manual beta phase.

## Notes for Manual Testing

When testing the complete flow:
1. Use Stripe test card: 4242 4242 4242 4242
2. Any future expiration date
3. Any 3-digit CVC
4. Any name and postal code

For testing file upload validation:
- Create a test PDF file < 10MB
- Create a non-PDF file (e.g., .jpg or .txt)
- Find or create a PDF file > 10MB

## Environment Variables Check

Ensure these environment variables are properly set:
- STRIPE_SECRET_KEY
- STRIPE_PRICE_ID
- NEXT_PUBLIC_BASE_URL
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY