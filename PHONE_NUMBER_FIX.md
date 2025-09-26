# Phone Number Issue Fix

## Problem Description

The `event.request.userAttributes?.phone_number` was empty in the `createAuthChallenge` Lambda function, preventing SMS from being sent through AWS SNS.

## Root Cause

1. **Missing User Creation**: The codebase had no user registration/signup process
2. **Missing Phone Attribute**: Users weren't being created with the `phone_number` attribute in Cognito
3. **Authentication Without Registration**: The system tried to authenticate users that didn't exist

## Solution Overview

### 1. Backend Changes

#### Updated `cognitoService.ts`

- Added `createUserIfNotExists()` function that:
  - Checks if user exists using `AdminGetUserCommand`
  - Creates user with `phone_number` attribute if they don't exist
  - Sets `phone_number_verified` to true (verified through OTP)
  - Suppresses welcome messages

#### Updated `authController.ts`

- Modified `startAuth()` to call `createUserIfNotExists()` before initiating auth
- Ensures user exists with proper phone_number attribute before authentication

### 2. Lambda Function Improvements

#### Updated `createAuthChallenge.js`

- Added fallback logic to get phone number from `event.userName` if `userAttributes.phone_number` is missing
- Improved error handling and logging
- Better SMS sending with proper error handling
- Comprehensive logging for debugging

#### Updated `defineAuthChallenge.js`

- Added attempt limiting (max 3 attempts)
- Improved logging and error handling
- Clean challenge flow logic

#### Updated `verifyAuthChallengeResponse.js`

- Enhanced logging for debugging
- Clean OTP verification logic

## Implementation Details

### User Creation Flow

```javascript
// When /auth/start is called:
1. Phone number is normalized to E.164 format
2. createUserIfNotExists() is called:
   - Tries AdminGetUserCommand to check if user exists
   - If UserNotFoundException, creates user with AdminCreateUserCommand
   - Sets phone_number and phone_number_verified attributes
3. InitiateAuth is called with CUSTOM_AUTH flow
```

### Lambda Function Flow

```javascript
// createAuthChallenge Lambda:
1. Generates 6-digit OTP
2. Gets phone number from userAttributes.phone_number OR event.userName (fallback)
3. Stores OTP in privateChallengeParameters
4. Sends SMS via AWS SNS
5. Returns challenge parameters to Cognito
```

## Files Modified/Created

### Backend Files

- `src/services/cognitoService.ts` - Added user creation function
- `src/controllers/authController.ts` - Updated to create users before auth

### Lambda Functions

- `createAuthChallenge.js` - New clean version with fallback logic
- `defineAuthChallenge.js` - New clean version with attempt limiting
- `verifyAuthChallengeResponse.js` - New clean version with better logging

### Documentation

- `PHONE_NUMBER_FIX.md` - This documentation file

## Testing the Fix

### 1. Test User Creation

```bash
# Call /auth/start with a new phone number
curl -X POST http://localhost:3000/auth/start \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'

# Should create user and return challenge
```

### 2. Test SMS Delivery

- Check CloudWatch logs for the createAuthChallenge Lambda
- Should see "SMS sent successfully" message
- User should receive OTP via SMS

### 3. Test Complete Flow

```bash
# 1. Start auth
curl -X POST http://localhost:3000/auth/start \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'

# 2. Respond with OTP
curl -X POST http://localhost:3000/auth/respond \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "otp": "123456", "session": "SESSION_FROM_STEP_1"}'
```

## Deployment Instructions

### 1. Deploy Backend Changes

```bash
npm run build
npm start
```

### 2. Deploy Lambda Functions

1. Replace the existing Lambda function code with the new versions:

   - `createAuthChallenge.js`
   - `defineAuthChallenge.js`
   - `verifyAuthChallengeResponse.js`

2. Ensure Lambda functions have proper IAM permissions:
   - `cognito-idp:AdminGetUser`
   - `cognito-idp:AdminCreateUser`
   - `sns:Publish`

### 3. Cognito Configuration

Ensure your Cognito User Pool has:

- `phone_number` as a standard attribute
- Custom authentication flow enabled
- Lambda triggers properly configured

## Monitoring and Debugging

### CloudWatch Logs

Monitor these log groups:

- `/aws/lambda/createAuthChallenge`
- `/aws/lambda/defineAuthChallenge`
- `/aws/lambda/verifyAuthChallengeResponse`

### Key Log Messages

- "Phone number from userAttributes: +91XXXXXXXXXX"
- "Phone number from userName: +91XXXXXXXXXX" (fallback)
- "SMS sent successfully to: +91XXXXXXXXXX"
- "User created successfully" (from backend)

### Common Issues

1. **SNS Permissions**: Ensure Lambda has SNS publish permissions
2. **Phone Format**: Ensure phone numbers are in E.164 format
3. **User Pool Config**: Verify phone_number is a standard attribute
4. **Region Settings**: Ensure SNS region matches your setup

## Security Considerations

1. **OTP Storage**: OTPs are stored in Cognito's private challenge parameters
2. **Attempt Limiting**: Maximum 3 authentication attempts
3. **Phone Verification**: Users are marked as phone_number_verified after OTP verification
4. **No Password**: System uses passwordless authentication only

## Future Enhancements

1. **HMAC OTPs**: Consider using HMAC for OTP generation instead of plaintext
2. **Rate Limiting**: Add rate limiting for SMS sending
3. **OTP Expiry**: Implement time-based OTP expiry
4. **Audit Logging**: Add comprehensive audit logs for security
