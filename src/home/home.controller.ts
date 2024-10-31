import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto } from './dtos/home.dto';

@Controller('home')
export class HomeController {
    constructor(private readonly homeService : HomeService){}
    @Get()
    async (){
        return this.homeService.getHomes();
    }

    @Get(':id')
    async getHomeById(@Param('id', ParseUUIDPipe) id : string){
        return this.homeService.getHomeById(id);
    }

    @Post()
    async createHome(@Body() createHomepayload : CreateHomeDto){
        return this.homeService.createHome(createHomepayload);
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
