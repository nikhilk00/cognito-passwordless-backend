import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import config from "../config";

let client: CognitoIdentityProviderClient | null = null;

export function getCognitoClient() {
  if (!client) {
    client = new CognitoIdentityProviderClient({ region: config.region });
  }
  return client;
}
