# Error Handling Documentation

This document describes the comprehensive error handling implementation for the AI Personal Assistant frontend application.

## Overview

The application implements multiple layers of error handling to ensure a robust user experience:

1. **React Error Boundaries** - Catch React component errors
2. **API Error Handling** - Handle network and API errors
3. **Toast Notifications** - Provide user feedback
4. **User-Friendly Messages** - Convert technical errors to readable messages

## Components

### 1. Error Boundary (`ErrorBoundary.tsx`)

A React Error Boundary component that catches JavaScript errors anywhere in the component tree.

**Features:**
- Catches unhandled React errors
- Displays fallback UI with error details
- Provides "Try Again" and "Go Home" actions
- Logs errors to console for debugging

**Usage:**
```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

The Error Boundary is automatically applied at the root layout level, protecting the entire application.

### 2. Toast Notification System (`ToastContext.tsx`)

A context-based toast notification system for displaying temporary messages to users.

**Features:**
- Success, error, warning, and info toast types
- Auto-dismiss after 5 seconds
- Manual dismiss option
- Animated slide-in effect
- Stacked notifications

**Usage:**
```tsx
const { showToast } = useToast();

// Show success message
showToast('Operation successful!', 'success');

// Show error message
showToast('Something went wrong', 'error');
```

### 3. API Error Handling (`api.ts`)

Centralized API error handling with user-friendly messages.

**Features:**
- Custom `ApiError` class with status codes
- Automatic error message mapping
- Network error detection
- Consistent error format across all API calls

**Error Status Code Mapping:**
- `401` → "Invalid username or password"
- `403` → "You do not have permission to access this resource"
- `404` → "The requested resource was not found"
- `409` → "This username is already taken"
- `500` → "Something went wrong on our end. Please try again later"
- `503` → "Service is temporarily unavailable. Please try again later"
- Network errors → "Unable to connect to server. Please check your internet connection"

### 4. Error Handling Utilities (`errorHandling.ts`)

Utility functions for consistent error handling across the application.

**Functions:**
- `isNetworkError()` - Check if error is a network error
- `isAuthError()` - Check if error is an authentication error
- `isNotFoundError()` - Check if error is a 404 error
- `isServerError()` - Check if error is a server error (5xx)
- `getErrorMessage()` - Get user-friendly error message
- `logError()` - Log errors for debugging
- `handleError()` - Complete error handling with logging and message

## Error Scenarios Coverage

All error scenarios from the design document are handled:

### 1. Network Failure
**Scenario:** Unable to connect to the backend server
**Message:** "Unable to connect to server. Please check your internet connection"
**Handling:** Displayed in toast notification and inline error message

### 2. Invalid Credentials
**Scenario:** Login with incorrect username or password
**Message:** "Invalid username or password"
**Handling:** Displayed on login form and in toast notification

### 3. Session Not Found
**Scenario:** Accessing a non-existent session
**Message:** "Session not found"
**Handling:** Full-page error with "Back to Sessions" button

### 4. Unauthorized Access
**Scenario:** Attempting to access protected routes without authentication
**Message:** Automatic redirect to login page
**Handling:** Protected route wrapper redirects unauthenticated users

### 5. Server Error
**Scenario:** Backend server error (5xx status codes)
**Message:** "Something went wrong on our end. Please try again later"
**Handling:** Displayed in toast notification and inline error message

## Implementation by Page

### Login Page
- Displays inline error messages below form
- Shows toast notification on error
- Handles invalid credentials gracefully
- Shows success toast on successful login

### Signup Page
- Displays inline error messages below form
- Shows toast notification on error
- Shows success toast and inline message on successful signup
- Handles duplicate username errors

### Sessions Page
- Shows toast notification on session load errors
- Displays inline error banner for persistent errors
- Shows success toast when creating new session
- Handles empty state gracefully

### Chat Page
- Shows toast notification on message send errors
- Displays inline error banner for persistent errors
- Full-page error UI for session not found
- Handles empty chat history gracefully

## Best Practices

1. **Always use try-catch blocks** around async operations
2. **Display errors in two places:**
   - Toast notification for immediate feedback
   - Inline error message for persistent context
3. **Clear errors** when user retries or navigates away
4. **Log errors** for debugging purposes
5. **Provide actionable feedback** (e.g., "Try again" button)
6. **Use user-friendly language** instead of technical jargon

## Testing Error Handling

To test error handling:

1. **Network Errors:** Disconnect from internet and try any action
2. **Invalid Credentials:** Try logging in with wrong password
3. **Session Not Found:** Navigate to `/chat/invalid-session-id`
4. **Server Errors:** Mock API to return 500 status codes
5. **React Errors:** Throw an error in a component to test Error Boundary

## Future Enhancements

Potential improvements for error handling:

1. **Error Tracking Service:** Integrate with Sentry or similar service
2. **Retry Logic:** Automatic retry for transient network errors
3. **Offline Mode:** Cache data for offline access
4. **Error Analytics:** Track error frequency and types
5. **Custom Error Pages:** Dedicated pages for different error types
