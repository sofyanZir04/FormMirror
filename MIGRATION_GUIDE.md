# Migration Guide: Ad-Blocker Friendly Form Entry

## Overview
This guide explains how to migrate from the old analytics/tracking endpoints to the new ad-blocker friendly form entry system.

## Why Migrate?
The old endpoints (`/api/analytics`, `/api/track`) may be blocked by ad blockers like uBlock Origin because:
- They contain tracking-related keywords in the URL
- They may send data patterns that ad blockers identify as analytics
- The endpoint names suggest data collection/tracking

## New Ad-Blocker Friendly Endpoint
- **New Endpoint**: `/api/form-entry`
- **Purpose**: Handles form submissions and data collection without triggering ad blockers
- **Method**: POST
- **Content-Type**: application/json

## Migration Steps

### 1. Update Client-Side Code
Replace old tracking calls with the new form entry endpoint:

**Before:**
```javascript
// Old - may be blocked by ad blockers
fetch('/api/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    project_id: '123',
    event_type: 'form_submit',
    field_name: 'email',
    session_id: 'sess-456'
  })
})
```

**After:**
```javascript
// New - ad-blocker friendly
fetch('/api/form-entry', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    formId: '123',
    data: {
      eventType: 'form_submit',
      fieldName: 'email',
      sessionId: 'sess-456'
    }
  })
})
```

### 2. Update Database Schema (if needed)
The new endpoint writes to a `form_entries` table instead of `form_events`. You may need to adjust your database schema:

```sql
-- Create the form_entries table if it doesn't exist
CREATE TABLE form_entries (
  id SERIAL PRIMARY KEY,
  form_id TEXT NOT NULL,
  submitted_data JSONB,
  user_agent TEXT,
  ip_address TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### 3. Backend Implementation
The new endpoint handles:
- Proper CORS headers with dynamic origin
- Server-side Supabase operations
- Input validation
- Error handling

## Key Benefits of New System

### 1. Ad Blocker Resistant
- Endpoint name doesn't contain tracking-related keywords
- Minimal data payload to avoid ad blocker patterns
- First-party request that looks legitimate

### 2. Proper CORS Handling
- `Access-Control-Allow-Origin: req.headers.origin`
- `Access-Control-Allow-Credentials: true`
- `Access-Control-Allow-Methods: GET,POST,OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With`
- OPTIONS preflight with status 204

### 3. Server-Side Security
- Database operations happen server-side
- No client-side database credentials exposed
- Proper validation and sanitization

## Client-Side Implementation Example

```jsx
// Using the new form entry endpoint
const submitForm = async (formId, formData) => {
  try {
    const response = await fetch('/api/form-entry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formId: formId,
        data: formData  // Optional: additional form data
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Form submitted successfully:', result);
    } else {
      console.error('Form submission failed:', result.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

## Testing the New Endpoint

1. Use the `FormEntryClient` component to test
2. Check browser Network tab to confirm requests are not blocked
3. Verify data is correctly stored in Supabase
4. Test with ad blockers enabled to ensure compatibility

## Complete Replacement Strategy

For a complete migration, replace all instances of:

- `/api/analytics` → `/api/form-entry`
- `/api/track` → `/api/form-entry`
- `/api/events` → `/api/form-entry`

## Rollback Plan
If issues arise, you can temporarily maintain both endpoints, but the old ones may continue to be blocked by ad blockers.

## Support
For questions about the migration, refer to `AD_BLOCKER_FORM_ENTRY_INSTRUCTIONS.md` or contact support.