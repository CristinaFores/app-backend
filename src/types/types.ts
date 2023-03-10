import type { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";
import type * as core from "express-serve-static-core";

export interface CustomRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any
> extends Request<P, ResBody, ReqBody> {
  userId: string;
}

export interface UserTokenPayload extends JwtPayload {
  id: string;
  username: string;
}
