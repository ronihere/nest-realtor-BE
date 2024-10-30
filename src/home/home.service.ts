import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { HomeResponseDto } from './dtos/home.dto';

@Injectable()
export class HomeService {
    constructor(private readonly prismaService: PrismaService){}
    async getHomes(){
        const homes = await this.prismaService.home.findMany({});
        return homes.map(home => new HomeResponseDto(home));
    }

    async getHomeById(){
    }

    async createHome(){
    }

    async updateHome(){
    }

    async deleteHome(){
    }
}
