# Installation Guide

## Troubleshooting npm install

If you encounter errors during `npm install`, try these steps:

### 1. Clear npm cache

```bash
npm cache clean --force
```

### 2. Delete node_modules and package-lock.json

```bash
rm -rf node_modules package-lock.json
```

### 3. Use npm install with legacy peer deps

```bash
npm install --legacy-peer-deps
```

### 4. Alternative: Use yarn instead of npm

```bash
# Install yarn if you don't have it
npm install -g yarn

# Install dependencies with yarn
yarn install
```

### 5. Install specific problematic packages individually

If `jwks-rsa` still causes issues, try:

```bash
npm install jwks-rsa@2.1.5 --save
```

### 6. Node.js version compatibility

Ensure you're using Node.js version 16 or higher:

```bash
node --version
```

If you need to update Node.js, visit: https://nodejs.org/

### 7. Alternative package.json with conservative versions

If issues persist, try this minimal version:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "@aws-sdk/client-cognito-identity-provider": "^3.300.0",
    "jsonwebtoken": "^8.5.1",
    "jwks-rsa": "^2.0.5",
    "helmet": "^6.0.0",
    "cors": "^2.8.5",
    "winston": "^3.8.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.0.0"
  }
}
```

## Successful Installation

Once installation succeeds, you should see:

- `node_modules/` directory created
- `package-lock.json` file generated
- No error messages in terminal

Then you can run:

```bash
npm run dev
```
