import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  AdminCreateUserCommand,
  AdminGetUserCommand,
  AuthFlowType,
  ChallengeNameType,
  MessageActionType,
} from "@aws-sdk/client-cognito-identity-provider";
import { getCognitoClient } from "../libs/cognitoClient";
import config from "../config";

const client = getCognitoClient();

export async function createUserIfNotExists(phone: string) {
  try {
    // First, try to get the user to see if they exist
    const getUserParams = {
      UserPoolId: config.userPoolId,
      Username: phone,
    };
    await client.send(new AdminGetUserCommand(getUserParams));
    return { userExists: true };
  } catch (error: any) {
    // If user doesn't exist, create them
    if (error.name === "UserNotFoundException") {
      const createUserParams = {
        UserPoolId: config.userPoolId,
        Username: phone,
        UserAttributes: [
          {
            Name: "phone_number",
            Value: phone,
          },
          {
            Name: "phone_number_verified",
            Value: "true", // We'll verify through OTP
          },
        ],
        MessageAction: MessageActionType.SUPPRESS, // Don't send welcome email/SMS
        TemporaryPassword: undefined, // No password needed for custom auth
      };

      await client.send(new AdminCreateUserCommand(createUserParams));
      return { userExists: false, userCreated: true };
    }
    throw error;
  }
}

export async function initiateAuth(phone: string) {
  const params = {
    AuthFlow: AuthFlowType.CUSTOM_AUTH,
    ClientId: config.clientId,
    AuthParameters: {
      USERNAME: phone,
    },
  };
  const cmd = new InitiateAuthCommand(params);
  return client.send(cmd);
}

export async function respondToAuthChallenge(
  phone: string,
  otp: string,
  session: string
) {
  const params = {
    ChallengeName: ChallengeNameType.CUSTOM_CHALLENGE,
    ClientId: config.clientId,
    ChallengeResponses: {
      USERNAME: phone,
      ANSWER: otp,
    },
    Session: session,
  };
  const cmd = new RespondToAuthChallengeCommand(params);
  return client.send(cmd);
}
