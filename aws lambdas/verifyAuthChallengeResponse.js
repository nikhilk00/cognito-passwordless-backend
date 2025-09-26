// verifyAuthChallengeResponse.js
// Verifies the user's response to the authentication challenge
export const handler = async (event) => {
  console.log(
    "VerifyAuthChallengeResponse event:",
    JSON.stringify(event, null, 2)
  );

  /*
    event.request.privateChallengeParameters = { otp: '123456' } // what we created earlier
    event.request.challengeAnswer = '123456' // what user submitted through RespondToAuthChallenge
  */

  const expected =
    event.request.privateChallengeParameters &&
    event.request.privateChallengeParameters.otp;
  const provided = event.request.challengeAnswer;

  console.log("Expected OTP:", expected);
  console.log("Provided OTP:", provided);

  // Initialize response
  event.response = event.response || {};

  if (expected && provided && provided === expected) {
    console.log("OTP verification successful");
    event.response.answerCorrect = true;
  } else {
    console.log("OTP verification failed");
    event.response.answerCorrect = false;
  }

  console.log(
    "VerifyAuthChallengeResponse response:",
    JSON.stringify(event.response, null, 2)
  );
  return event;
};
