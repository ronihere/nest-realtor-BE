import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
    constructor(private readonly homeService : HomeService){}
    @Get()
    async (){
        return this.homeService.getHomes();
    }

    @Get(':id')
    async getHomeById(){
        return this.homeService.getHomeById();
    }

    @Post()
    async createHome(){
        return this.homeService.createHome();
    }

    @Put()
    async updateHome(){
        return this.homeService.updateHome();
    }

    @Delete(':id')
    async deleteHome(){
        return this.homeService.deleteHome();
    }
}
