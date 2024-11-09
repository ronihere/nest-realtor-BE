import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaServiceModule } from './prisma-service/prisma-service.module';
import { HomeModule } from './home/home.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Userinterceptor } from './GlobalInterceptor/Userinterceptor.Interceptor';
import { AuthGuard } from './Guards/Auth.Guard';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [AuthModule, PrismaServiceModule, HomeModule, ConfigModule.forRoot({isGlobal: true}), CloudinaryModule],
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
