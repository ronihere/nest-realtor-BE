import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaServiceModule } from './prisma-service/prisma-service.module';
import { HomeModule } from './home/home.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Userinterceptor } from './GlobalInterceptor/Userinterceptor.Interceptor';
import { AuthGuard } from './Guards/Auth.Guard';

@Module({
  imports: [AuthModule, PrismaServiceModule, HomeModule],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_INTERCEPTOR,
    useClass: Userinterceptor
  },
  {
    provide: APP_GUARD,
    useClass: AuthGuard
  }
],
})
export class AppModule {}
