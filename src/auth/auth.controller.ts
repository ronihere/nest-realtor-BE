import {  BadRequestException, Body, Controller, Get, Param, ParseEnumPipe, Post } from '@nestjs/common';
import { TProductKeyDto, TSignInDto, TSignUpDto } from './dtos/auth.dtos';
import { AuthService } from './auth.service';
import { USERTYPE } from '@prisma/client';
import * as bcrypt from "bcryptjs";

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService : AuthService){}

    @Post('signin')
    async signIn(@Body() {email, password}: TSignInDto){
        return this.AuthService.signIn({email, password})
    }
    
    @Post('/signup/:usertype')
    async signUp(@Body() {email,password, userName, productkey }: TSignUpDto, @Param('usertype', new ParseEnumPipe(USERTYPE)) usertype: USERTYPE){
        if(usertype !== USERTYPE.BUYER){
            if(!productkey){
                throw new BadRequestException({message:"Product key is required to login. Please contact your admin."})
            }
            const productKeyString = `${email}-${usertype}-${process.env.GENERATE_PRODUCT_KEY_SECRET}`
            const isValidProductKey = bcrypt.compare(productKeyString , productkey);
            if(!isValidProductKey){
                throw new BadRequestException({message:"Invalid Product Key. Please react out to your admin."})
            }
        }
        return this.AuthService.signUp({email, password,userName, userType: usertype});
    }

    @Get('/key')
    getProductKey(@Body() {email,type} : TProductKeyDto){
        //TODO: later there should be a check to validate if the user that is requesting for the key is an Admin
        return this.AuthService.getProductKey({email, type});
    }
}
