import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  region: process.env.AWS_REGION || "ap-south-1",
  userPoolId: process.env.COGNITO_USER_POOL_ID || "",
  clientId: process.env.COGNITO_CLIENT_ID || "",
  logLevel: process.env.LOG_LEVEL || "info",
};
