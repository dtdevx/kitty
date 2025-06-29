import { Request, Response } from 'express';

import { AuthService } from '@app/auth/auth.service';
import { LoginUserDto } from '@app/auth/dto/login-user.dto';
import { AuthResponseInterface } from '@app/auth/types/auth-response.interface';
import { clearAuthCookies, setAuthCookies } from '@app/utils/cookie.util';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseInterface> {
    const tokens = await this.authService.login(loginUserDto);
    setAuthCookies(res, tokens);
    return tokens;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: AuthResponseInterface) {
    return user;
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseInterface> {
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const tokens = await this.authService.refresh(refreshToken, accessToken);
    setAuthCookies(res, tokens);
    return tokens;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    clearAuthCookies(res);
    return { message: 'Logout successful' };
  }
}
