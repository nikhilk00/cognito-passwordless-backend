// createAuthChallenge.js
// Improved version that handles missing phone_number attribute
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

export const handler = async (event) => {
  console.log("CreateAuthChallenge event:", JSON.stringify(event, null, 2));

  // event.request contains userAttributes, clientMetadata, session, etc.
  // We only act when this is a new CUSTOM_CHALLENGE
  if (event.request.session && event.request.session.length === 0) {
    console.log("First challenge - initializing");
  }

  // Only create when challengeName === 'CUSTOM_CHALLENGE'
  if (event.request.challengeName !== "CUSTOM_CHALLENGE") {
    console.log("Not a CUSTOM_CHALLENGE, skipping");
    return event;
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Get phone number from userAttributes or fallback to username
  let phoneNumber = null;

  if (
    event.request.userAttributes &&
    event.request.userAttributes.phone_number
  ) {
    phoneNumber = event.request.userAttributes.phone_number;
    console.log("Phone number from userAttributes:", phoneNumber);
  } else if (event.userName) {
    // Fallback: use username as phone number (our implementation uses phone as username)
    phoneNumber = event.userName;
    console.log("Phone number from userName:", phoneNumber);
  } else {
    console.error("No phone number found in userAttributes or userName");
    console.log("UserAttributes:", event.request.userAttributes);
    console.log("UserName:", event.userName);
  }

  // Initialize response object
  event.response = event.response || {};
  event.response.publicChallengeParameters = {
    phone_number: phoneNumber,
  };

  // Store OTP in privateChallengeParameters (Cognito stores this in the session)
  event.response.privateChallengeParameters = { otp };
  event.response.challengeMetadata = `OTP:${otp}`; // Cognito will include this in the session

  console.log("Generated OTP:", otp);
  console.log("Phone number for SMS:", phoneNumber);

  // Send SMS using AWS SNS if phone number is available
  if (phoneNumber) {
    try {
      const sns = new SNSClient({
        region: process.env.AWS_REGION || "ap-south-1",
      });
      await sns.send(
        new PublishCommand({
          Message: `Your OTP is ${otp}`,
          PhoneNumber: phoneNumber,
        })
      );
      console.log("SMS sent successfully to:", phoneNumber);
    } catch (error) {
      console.error("Failed to send SMS:", error);
      // Don't fail the challenge if SMS fails - continue with the flow
    }
  } else {
    console.error("Cannot send SMS: phone number is null");
  }

  console.log(
    "CreateAuthChallenge response:",
    JSON.stringify(event.response, null, 2)
  );
  return event;
};
