import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaServiceModule } from './prisma-service/prisma-service.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [AuthModule, PrismaServiceModule, HomeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
