# Cognito Passwordless Backend

TypeScript Express backend for AWS Cognito passwordless SMS authentication using CUSTOM_AUTH flow.

## Features

- 🔐 Passwordless authentication via SMS OTP
- 📱 Phone number normalization (E.164 format)
- 🛡️ JWT token verification middleware
- 🧪 Comprehensive test suite with Jest
- 📝 ESLint configuration for code quality
- 🚀 Production-ready with proper error handling
- 📋 Postman collection for API testing

## Prerequisites

- Node.js 16+
- AWS Account with Cognito User Pool configured
- AWS Cognito Lambda triggers deployed (see Lambda functions in RTF files)

## Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file with the following variables:

   ```env
   PORT=3000
   AWS_REGION=ap-south-1
   COGNITO_USER_POOL_ID=your-user-pool-id
   COGNITO_CLIENT_ID=your-client-id
   LOG_LEVEL=info
   ```

3. **Development**

   ```bash
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Health Check

- **GET** `/health`
- Returns server status

### Authentication Flow

#### 1. Start Authentication

- **POST** `/auth/start`
- **Body**: `{ "phone": "+919876543210" }`
- **Response**: `{ "challenge": "CUSTOM_CHALLENGE", "session": "session-token" }`

#### 2. Respond to Challenge

- **POST** `/auth/respond`
- **Body**: `{ "phone": "+919876543210", "otp": "123456", "session": "session-token" }`
- **Response**:
  ```json
  {
    "idToken": "jwt-id-token",
    "accessToken": "jwt-access-token",
    "refreshToken": "refresh-token",
    "expiresIn": 3600
  }
  ```

## Postman Collection

Import the provided Postman collection and environment:

- `postman-collection.json` - API endpoints with examples
- `postman-environment.json` - Environment variables

The collection includes:

- Automatic session token extraction
- JWT token management
- Example requests and responses
- Error scenarios

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run linting
npm run lint
```

## Project Structure

```
src/
├── config/           # Configuration management
├── controllers/      # Request handlers
├── libs/            # External service clients
├── middlewares/     # Express middlewares
├── routes/          # Route definitions
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── tests/           # Test files
```

## AWS Cognito Setup

This backend requires three Lambda triggers to be deployed in your Cognito User Pool:

1. **Create Auth Challenge** - Generates SMS OTP
2. **Define Auth Challenge** - Defines authentication flow
3. **Verify Auth Challenge Response** - Validates OTP

Refer to the RTF files in the project root for Lambda function implementations.

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting (configured but not active)
- JWT token verification
- Input validation and sanitization

## Phone Number Format

The API accepts various phone number formats and normalizes them to E.164:

- `+919876543210` (already E.164)
- `9876543210` (10-digit Indian mobile)
- `09876543210` (with leading zero)

## Error Handling

Comprehensive error handling with:

- Structured error responses
- Logging with Winston
- Graceful failure modes
- HTTP status codes

## Environment Variables

| Variable               | Description          | Default    |
| ---------------------- | -------------------- | ---------- |
| `PORT`                 | Server port          | 3000       |
| `AWS_REGION`           | AWS region           | ap-south-1 |
| `COGNITO_USER_POOL_ID` | Cognito User Pool ID | Required   |
| `COGNITO_CLIENT_ID`    | Cognito Client ID    | Required   |
| `LOG_LEVEL`            | Logging level        | info       |

## Development Notes

- Uses TypeScript with strict mode
- Express.js with modern middleware stack
- AWS SDK v3 for Cognito integration
- Jest for testing with supertest
- ESLint for code quality
- Nodemon for development hot reload

## License

Private project - All rights reserved.
