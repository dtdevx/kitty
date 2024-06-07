import * as bcrypt from 'bcrypt';

import { LoginUserDto } from '@app/auth/dto/login-user.dto';
import { AuthResponseInterface } from '@app/auth/types/auth-response.interface';
import {
  HOUR_IN_SECONDS,
  WEEK_IN_SECONDS,
} from '@app/constants/time.constants';
import { UserType } from '@app/users/types/user.type';
import { UserService } from '@app/users/user.service';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('AuthService');

  private tokenBlacklist: Set<string> = new Set();
  private tokenBlacklistCleanerInterval: ReturnType<typeof setInterval>;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit(): Promise<void> {
    const tokenCleanUpInterval = +this.configService.get(
      'APP_JWT_CLEANUP_INTERVAL_MILLISECONDS',
      60000,
    );
    this.tokenBlacklistCleanerInterval = setInterval(() => {
      this.cleanUpTokenBlacklist();
    }, tokenCleanUpInterval);
  }

  async onModuleDestroy(): Promise<void> {
    clearInterval(this.tokenBlacklistCleanerInterval);
  }

  async cleanUpTokenBlacklist() {
    this.logger.log('Token-Cleanup started.');
    const currentTime = Date.now() / 1000;
    const amountAll = this.tokenBlacklist.size;
    let amountRemoved = 0;
    this.tokenBlacklist.forEach((token) => {
      try {
        const jwt = this.jwtService.decode(token);
        if (jwt && jwt.expires && jwt.expires >= currentTime) {
          this.tokenBlacklist.delete(token);
          amountRemoved++;
        }
      } catch (error) {
        this.logger.error(
          `TokenBlacklist Cleaner: Error decoding token: ${token}`,
          error,
        );
      }
    });
    this.logger.log(
      `Token-Cleanup finished. (Removed ${amountRemoved} of ${amountAll}).`,
    );
  }

  generateJwtToken(user: User | UserType): AuthResponseInterface {
    const { id, name } = user;
    return {
      accessToken: this.jwtService.sign(
        { id, name },
        { expiresIn: 1 * HOUR_IN_SECONDS },
      ),
      refreshToken: this.jwtService.sign(
        { id, name },
        { expiresIn: 1 * WEEK_IN_SECONDS },
      ),
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponseInterface> {
    const user = (await this.userService.findByEmail(
      loginUserDto.email,
      false,
    )) as User;
    if (!user || !bcrypt.compareSync(loginUserDto.password, user.password)) {
      throw new UnauthorizedException(
        'Email and password combination not valid',
      );
    }
    return this.generateJwtToken(user);
  }

  async refresh(
    refreshToken: string,
    accessToken: string = null,
  ): Promise<AuthResponseInterface> {
    const payload = this.jwtService.verify(refreshToken);
    const user = await this.userService.findById(payload.id);
    this.tokenBlacklist.add(refreshToken);
    if (accessToken) {
      this.tokenBlacklist.add(accessToken);
    }
    return this.generateJwtToken(user);
  }

  logout(accessToken: string, refreshToken: string): boolean {
    this.tokenBlacklist.add(accessToken);
    this.tokenBlacklist.add(refreshToken);
    return true;
  }
}
