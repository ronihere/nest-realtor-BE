import {  BadRequestException, Body, Controller, Get, Param, ParseEnumPipe, Post } from '@nestjs/common';
import { TProductKeyDto, TSignInDto, TSignUpDto } from './dtos/auth.dtos';
import { AuthService } from './auth.service';
import { USERTYPE } from '@prisma/client';
import * as bcrypt from "bcryptjs";
import { Roles } from 'src/Decorators/Roles.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService : AuthService){}
    
    @Post('signin')
    async signIn(@Body() {email, password}: TSignInDto){
        console.log('in signin controller')
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

    @Roles(USERTYPE.ADMIN)
    @Get('/key')
    getProductKey(@Body() {email,type} : TProductKeyDto){
        return this.AuthService.getProductKey({email, type});
    }
}


//Realtor
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMWI0YTVkLTUzZDgtNGY3Yy1hODFkLTVlYmJlOTQ1N2UwMiIsImVtYWlsIjoicm9uaTJAaG90bWFpbC5jb20iLCJuYW1lIjoicm9uaTIiLCJ0eXBlIjoiUkVBTFRPUiIsImlhdCI6MTczMDQ0NzQ3NCwiZXhwIjoxNzY2NDQ3NDc0fQ.iHOTVxJf1fbBbVA2yojD0BWWhiCwlC74funq6amZzfY


//Admin
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIxZDdlNTMyLTMxY2QtNDJiYS04ZGMzLWNkNDQ2ZmZhMGY5OSIsImVtYWlsIjoicm9uaTNAaG90bWFpbC5jb20iLCJuYW1lIjoicm9uaTMiLCJ0eXBlIjoiQURNSU4iLCJpYXQiOjE3MzA0NDc1MDEsImV4cCI6MTc2NjQ0NzUwMX0.RjGROmZ0Ij_m9joypgy5J7NXCSdOVBK4GpHbIf44vHw


// Buyer 
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA1ODhmZTFkLWM2NmEtNDBhYy1iZjE2LTA1ZThkNGM0MTA2ZSIsImVtYWlsIjoicm9uaTFAaG90bWFpbC5jb20iLCJuYW1lIjoicm9uaTEiLCJ0eXBlIjoiQlVZRVIiLCJpYXQiOjE3MzA0NDczMjgsImV4cCI6MTc2NjQ0NzMyOH0.20tnz13FBF8lmvrb6mbc4JolCZ12a_35bdhksSl2zHw