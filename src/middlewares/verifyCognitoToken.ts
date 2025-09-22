import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwks, issuer } from "../libs/jwksClient";

function getKey(header: any, callback: any) {
  jwks.getSigningKey(header.kid, (err: any, key: any) => {
    if (err) return callback(err);
    const pub = key.getPublicKey();
    callback(null, pub);
  });
}

export function verifyCognitoToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;
  if (!auth)
    return res.status(401).json({ error: "missing authorization header" });
  const token = auth.split(" ")[1];
  jwt.verify(token, getKey, { issuer }, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ error: "invalid token", details: err.message });
    }
    (req as any).user = decoded;
    next();
  });
}
