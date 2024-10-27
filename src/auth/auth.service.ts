import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { USERTYPE } from '@prisma/client';
import * as bcrypt from "bcryptjs"
import { TSignUpDto } from './dtos/auth.dtos';

@Injectable()
export class AuthService {
    constructor(private readonly PrismaService : PrismaService){}
    async signUp({userName, email,password, userType}:TSignUpDto){
        const isDuplicateUser = await this.PrismaService.user.findUnique({
            where:{
                email
            }
        })
        //throw error incase of duplicate email
        if(isDuplicateUser){
            throw new ConflictException({message:'duplicate entry'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.PrismaService.user.create({
            select:{
                email: true,
                name: true,
                type: true,
            },
            data:{
                email,
                password : hashedPassword,
                name: userName,
                type: userType || USERTYPE.BUYER
            }
        })
        
    }
}
