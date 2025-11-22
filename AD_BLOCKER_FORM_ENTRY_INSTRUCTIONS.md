# Ad-Blocker Friendly Form Entry System

## Overview
This implementation provides a robust frontend → backend → Supabase flow that avoids being blocked by ad blockers like uBlock Origin.

## Key Features
1. **Ad Blocker Safe Endpoint**: Uses `/api/form-entry` instead of tracking-related names
2. **Proper CORS Handling**: Includes all required headers for cross-origin requests
3. **Minimal Data Transfer**: Sends only essential data to avoid ad blocker classification
4. **Server-Side Database Operations**: All Supabase writes happen on the server

## API Endpoint: `/api/form-entry`

### POST Request
- **URL**: `/api/form-entry`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### Request Body
```json
{
  "formId": "123",
  "data": {
    // Optional: additional form data
  }
}
```

#### Response
- Success: `200 OK` with `{ success: true, message: "Form entry saved successfully" }`
- Error: `400/500` with `{ error: "Error message" }`

### CORS Headers
The endpoint properly handles CORS with:
- `Access-Control-Allow-Origin: req.headers.origin`
- `Access-Control-Allow-Credentials: true`
- `Access-Control-Allow-Methods: GET,POST,OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With`
- Proper OPTIONS preflight response with status 204

## Client-Side Usage

### Basic Implementation
```javascript
fetch("/api/form-entry", {
  method: "POST",
  headers: { 
    "Content-Type": "application/json" 
  },
  body: JSON.stringify({
    formId: "123",
    data: {
      // Additional form data if needed
    }
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### React Component Example
The `FormEntryClient` component demonstrates how to implement this in a React application.

## Security Considerations
- All database operations happen server-side using Supabase service role
- No client-side database credentials are exposed
- Input validation is performed on the server
- IP addresses and user agents are logged for analytics (optional)

## Why This Approach Works
1. **No Blocked Keywords**: The endpoint name avoids words like "analytics", "track", "events", etc.
2. **Minimal Payload**: Only essential data is sent, avoiding patterns that ad blockers recognize
3. **Proper Headers**: All CORS headers are correctly set to avoid browser security issues
4. **Server-Side Processing**: Database writes happen on the server, not in the browser
5. **First-Party Request**: The request goes to the same domain, making it appear legitimate to ad blockers

## Integration Tips
- Replace the example `form_entries` table with your actual Supabase table
- Add additional validation as needed for your specific use case
- Consider rate limiting for production applications
- Add authentication if needed for your specific use case