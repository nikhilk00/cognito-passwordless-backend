# Cognito passwordless CUSTOM_AUTH flow (summary)

- Client -> POST /auth/start with { phone }
  - Backend calls InitiateAuth (CUSTOM_AUTH) -> returns Session and ChallengeName (CUSTOM_CHALLENGE)
- Cognito triggers createAuthChallenge -> Lambda generates OTP and sends SMS (or Cognito handles SMS)
- User receives OTP and posts to POST /auth/respond { phone, otp, session }
  - Backend calls RespondToAuthChallenge -> if verified Cognito returns AuthenticationResult (tokens)

Notes:
- Keep the `session` returned by InitiateAuth and pass it to RespondToAuthChallenge.
- Normalize phone numbers to E.164 before calling Cognito.
