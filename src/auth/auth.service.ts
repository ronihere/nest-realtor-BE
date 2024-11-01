import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { USERTYPE } from '@prisma/client';
import * as bcrypt from "bcryptjs"
import { TProductKeyDto, TSignInDto, TSignUpDto } from './dtos/auth.dtos';
import { defaultTokenExpiryTime } from 'lib/constants';
import * as jwt from "jsonwebtoken"

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

    async signIn({email, password}: TSignInDto){
        console.log('in service signIn')

        const requestedEmailUser = await this.PrismaService.user.findUnique({
            where:{email}
        });
        if(!requestedEmailUser){
            throw new BadRequestException({message:"Invalid credentials"});
        }
        const hashedPassword = requestedEmailUser.password;
        const isValidPasswordProvided = await bcrypt.compare(password , hashedPassword);
        if(!isValidPasswordProvided){
            throw new BadRequestException({message:"Invalid credentials"})
        }
        delete requestedEmailUser.password
        return {token : await this.createJwt(requestedEmailUser)}
        
    }


    async createJwt(payload: Record<string,any>, expiresIn?: number){
        return jwt.sign(payload , process.env.JWT_SECRET , {expiresIn : expiresIn ?? defaultTokenExpiryTime})
    }

    async getProductKey({email, type}: TProductKeyDto){
        const user = await this.PrismaService.user.findUnique({
            where: {email}
        })
        if(!user){
            throw new NotFoundException();
        }
        const productKeytemplate = `${email}-${type}-${process.env.GENERATE_PRODUCT_KEY_SECRET}`
        return bcrypt.hash(productKeytemplate, 10);
    }
}
