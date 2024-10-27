import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaServiceModule } from './prisma-service/prisma-service.module';

@Module({
  imports: [AuthModule, PrismaServiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
