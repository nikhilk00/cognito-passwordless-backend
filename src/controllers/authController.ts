import { Request, Response, NextFunction } from "express";
import * as cognitoService from "../services/cognitoService";
import { toE164 } from "../utils/phone";

export async function startAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const phoneRaw = req.body.phone;
    if (!phoneRaw) return res.status(400).json({ error: "phone required" });
    const phone = toE164(phoneRaw);

    // Ensure user exists with phone_number attribute
    await cognitoService.createUserIfNotExists(phone);

    const resp = await cognitoService.initiateAuth(phone);
    return res.json({ challenge: resp.ChallengeName, session: resp.Session });
  } catch (err) {
    next(err);
  }
}

export async function respondAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { phone: phoneRaw, otp, session } = req.body;
    if (!phoneRaw || !otp || !session)
      return res.status(400).json({ error: "phone, otp and session required" });
    const phone = toE164(phoneRaw);
    const resp = await cognitoService.respondToAuthChallenge(
      phone,
      otp,
      session
    );
    if (resp.AuthenticationResult) {
      return res.json({
        idToken: resp.AuthenticationResult.IdToken,
        accessToken: resp.AuthenticationResult.AccessToken,
        refreshToken: resp.AuthenticationResult.RefreshToken,
        expiresIn: resp.AuthenticationResult.ExpiresIn,
      });
    }
    // additional challenge
    return res.json({ challenge: resp.ChallengeName, session: resp.Session });
  } catch (err) {
    next(err);
  }
}
