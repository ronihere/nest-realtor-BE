import { Body, Controller, Delete, Get, Param, ParseEnumPipe, ParseIntPipe, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeFilters, HomeSearchQueryDto, UpdateHomeDto } from './dtos/home.dto';
import { PROPERTYTYPE } from '@prisma/client';
import { CustomTransformerPipe, parseToInt } from './customValidationPipe/CustomValidationPipe';

@Controller('home')
export class HomeController {
    constructor(private readonly homeService : HomeService){}
    @Get()
    async getAllHomes(
        @Query('maxPrice', new CustomTransformerPipe(parseToInt,true)) maxPrice: number,
        @Query('minPrice', new CustomTransformerPipe(parseToInt,true)) minPrice: number,
        @Query('numberOfBedrooms', new CustomTransformerPipe(parseToInt,true)) numberOfBedrooms: number,
        @Query('numberOfBathrooms',new CustomTransformerPipe(parseToInt,true)) numberOfBathrooms : number,
        @Query('type') type : PROPERTYTYPE,
        @Query('city') city : string
    ){
        console.log({maxPrice, minPrice, numberOfBathrooms, numberOfBedrooms})
        const priceFilter = minPrice || maxPrice ? 
        {
            ...(minPrice && {gte : minPrice}),
            ...(maxPrice && {lte: maxPrice})
        }
        : 
        null;

        const filter: HomeFilters = {
            ...(city && {city}),
            ...(priceFilter && {price: priceFilter}),
            ...(type && {type}),
            ...(numberOfBedrooms && {number_of_bedrooms: numberOfBedrooms}),
            ...(numberOfBathrooms && {number_of_bathrooms: numberOfBathrooms}),
        }
        return this.homeService.getHomes(filter);
    }

    @Get(':id')
    async getHomeById(@Param('id', ParseUUIDPipe) id : string){
        return this.homeService.getHomeById(id);
    }

    @Post()
    async createHome(@Body() createHomepayload : CreateHomeDto){
        return this.homeService.createHome(createHomepayload);
    }

    @Put(":id")
    async updateHome(@Param('id', ParseUUIDPipe) id : string,@Body() updateHomepayload :UpdateHomeDto){
        return this.homeService.updateHome(id , updateHomepayload);
    }

    @Delete(':id')
    async deleteHome(@Param('id', ParseUUIDPipe) id : string){
        return this.homeService.deleteHome(id);
    }
}
