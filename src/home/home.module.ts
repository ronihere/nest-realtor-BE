import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  providers: [HomeService, PrismaService,CloudinaryService,{
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }],
  controllers: [HomeController],
})
export class HomeModule {}
