import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseEnumPipe, ParseFilePipe, ParseIntPipe, ParseUUIDPipe, Post, Put, Query, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeFilters, HomeSearchQueryDto, UpdateHomeDto } from './dtos/home.dto';
import { PROPERTYTYPE, USERTYPE } from '@prisma/client';
import { CustomTransformerPipe, parseToInt } from './customValidationPipe/CustomValidationPipe';
import { User } from 'src/Decorators/User.Decorator';
import { TokenUserInterface } from 'src/GlobalInterceptor/Userinterceptor.Interceptor';
import { Roles } from 'src/Decorators/Roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('home')
export class HomeController {
    constructor(private readonly homeService : HomeService){}

    @Roles(USERTYPE.BUYER, USERTYPE.REALTOR, USERTYPE.ADMIN)
    @Get()
    async getAllHomes(
        @Query('maxPrice', new CustomTransformerPipe(parseToInt,true)) maxPrice: number,
        @Query('minPrice', new CustomTransformerPipe(parseToInt,true)) minPrice: number,
        @Query('numberOfBedrooms', new CustomTransformerPipe(parseToInt,true)) numberOfBedrooms: number,
        @Query('numberOfBathrooms',new CustomTransformerPipe(parseToInt,true)) numberOfBathrooms : number,
        @Query('type') type : PROPERTYTYPE,
        @Query('city') city : string,
    ){
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



    @Roles(USERTYPE.BUYER, USERTYPE.REALTOR, USERTYPE.ADMIN)    
    @Get(':id')
    async getHomeById(@Param('id', ParseUUIDPipe) id : string){
        return this.homeService.getHomeById(id);
    }

    @Roles(USERTYPE.REALTOR)
    @Post(':id/image')
    @UseInterceptors(FileInterceptor('file'))
    async upsertHomeImage(@Param('id', ParseUUIDPipe) homeId : string,@UploadedFile(new ParseFilePipe({
        validators: [
        //   new MaxFileSizeValidator({ maxSize: 1000 }),
        //   new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      })) file: Express.Multer.File){
        console.log(file);
        return this.homeService.upsertHomeImage(homeId,file.filename || file.originalname || 'emptyfilename', file.buffer);
    }
    @Roles(USERTYPE.REALTOR)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async createHome(@Body() createHomepayload : CreateHomeDto,@UploadedFile(new ParseFilePipe({
        validators: []})) file: Express.Multer.File, @User() loggedInUser : TokenUserInterface){
            console.log({createHomepayload, file});
        if(loggedInUser.type !== 'REALTOR'){
            throw new UnauthorizedException({message:"Only a REALTOR user can post a new property."})
        }
        return this.homeService.createHome(createHomepayload, loggedInUser, file);
    }

    @Roles(USERTYPE.REALTOR, USERTYPE.ADMIN)
    @Put(":id")
    async updateHome(@Param('id', ParseUUIDPipe) id : string,@Body() updateHomepayload :UpdateHomeDto,  @User() loggedInUser: TokenUserInterface){
        return this.homeService.updateHome(id , updateHomepayload, loggedInUser.id);
    }

    @Roles(USERTYPE.ADMIN, USERTYPE.REALTOR)
    @Delete(':id')
    async deleteHome(@Param('id', ParseUUIDPipe) id : string, @User() loggedInUser: TokenUserInterface){
        return this.homeService.deleteHome(id, loggedInUser.id);
    }
}
