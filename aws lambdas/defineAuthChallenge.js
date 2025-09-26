// defineAuthChallenge.js
// Defines the authentication challenge flow
export const handler = async (event) => {
  console.log("DefineAuthChallenge event:", JSON.stringify(event, null, 2));

  /*
  event.request.session contains previous challenges and outcomes
  We set:
    event.response.issueTokens = boolean (if true, Cognito will issue tokens)
    event.response.failAuthentication = boolean
    event.response.challengeName = 'CUSTOM_CHALLENGE' or undefined
  */

  const session = event.request.session || [];
  const lastChallenge = session.length ? session[session.length - 1] : null;

  // Initialize response
  event.response = event.response || {};

  if (lastChallenge && lastChallenge.challengeResult === true) {
    // Previous challenge succeeded -> issue tokens
    console.log("Previous challenge succeeded, issuing tokens");
    event.response.issueTokens = true;
    event.response.failAuthentication = false;
    event.response.challengeName = undefined;
  } else if (session.length >= 3) {
    // Too many failed attempts -> fail authentication
    console.log("Too many failed attempts, failing authentication");
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
    event.response.challengeName = undefined;
  } else {
    // Issue a custom challenge
    console.log("Issuing custom challenge");
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "CUSTOM_CHALLENGE";
  }

  console.log(
    "DefineAuthChallenge response:",
    JSON.stringify(event.response, null, 2)
  );
  return event;
};
