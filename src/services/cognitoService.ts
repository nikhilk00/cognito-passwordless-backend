import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  AuthFlowType,
  ChallengeNameType,
} from "@aws-sdk/client-cognito-identity-provider";
import { getCognitoClient } from "../libs/cognitoClient";
import config from "../config";

const client = getCognitoClient();

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
