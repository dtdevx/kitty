import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@app/prisma/prisma.module';
import { UserModule } from '@app/users/user.module';
import { AuthModule } from '@app/auth/auth.module';
import { AuthMiddleware } from '@app/auth/middleware/auth.middleware';
import { RoleModule } from '@app/roles/role.module';
import { UserRoleModule } from '@app/user-roles/user-role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    RoleModule,
    UserRoleModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
