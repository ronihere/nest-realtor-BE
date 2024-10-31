import { USERTYPE } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class TSignUpDto {
    @IsString()
    @IsNotEmpty()
    userName: string

    @IsEmail()
    email: string

    @IsString()
    @MinLength(5,{
        message:'password must be of leangth 5 or greater.'
    })
    password: string

    userType?: USERTYPE 

    @IsOptional()
    productkey?: string
}


export class TSignInDto {
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}


export class TProductKeyDto{
    @IsEmail()
    email: string

    @IsEnum(USERTYPE)
    type: USERTYPE
}