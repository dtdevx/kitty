import { Response } from 'express';

import {
  HOUR_IN_SECONDS,
  WEEK_IN_SECONDS,
} from '@app/constants/time.constants';

export function setAuthCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken: string },
) {
  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: HOUR_IN_SECONDS * 1000,
  });
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: WEEK_IN_SECONDS * 1000,
  });
}

export function clearAuthCookies(res: Response) {
  res.cookie('accessToken', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
  res.cookie('refreshToken', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
}
