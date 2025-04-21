import { Role } from "prisma/generated/prisma/client";

export interface JwtPayloadInterface {
  roles: number[]
  accessToken: string;
  refreshToken: string;
}
