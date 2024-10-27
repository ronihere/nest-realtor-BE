import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';
import { TSignUpDto } from './dtos/auth.dtos';
import { AuthService } from './auth.service';
import { USERTYPE } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService : AuthService){}
    @Post(':usertype')
    async signUp(@Body() {email,password, userName }: TSignUpDto, @Param('usertype') usertype: USERTYPE){
        const validUserType = USERTYPE[usertype as keyof typeof USERTYPE];
        if(!validUserType){
            throw new BadRequestException({message:`The usertype must be either ${USERTYPE.ADMIN} , ${USERTYPE.BUYER} or ${USERTYPE.REALTOR}`});
        }
        return this.AuthService.signUp({email, password,userName, userType: usertype});
    }
}
