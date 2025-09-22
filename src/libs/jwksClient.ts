import jwksClient from "jwks-rsa";
import config from "../config";

const iss = `https://cognito-idp.${config.region}.amazonaws.com/${config.userPoolId}`;

export const jwks = jwksClient({
  jwksUri: `${iss}/.well-known/jwks.json`,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 600000,
});

export const issuer = iss;
