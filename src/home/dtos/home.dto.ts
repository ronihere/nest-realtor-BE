import { BUYCATEGORY, PROPERTYTYPE } from "@prisma/client";
import { Exclude, Expose, Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty,  IsNumber, IsOptional, IsPositive, IsString,  IsUrl,  ValidateNested } from "class-validator";

export class HomeResponseDto {
    id: string;
    address: string;
    @Exclude()
    number_of_bedrooms: number;
    @Expose({name:"numberOfBedrooms"})
    numberOfBedrooms(){
        return this.number_of_bedrooms
    }
    
    @Exclude()
    number_of_bathrooms: number;
    @Expose({name: "numberOfBathrooms"})
    numberOfBathrooms(){
        return this.number_of_bathrooms;
    }

    image: string

    @Exclude()
    authorId: number

    @Exclude()
    listed_date: Date;
    @Expose({name:'listedDate'})
    listedDate(){
        return this.listed_date
    }

    type: PROPERTYTYPE;

    @Exclude()
    buy_type: BUYCATEGORY;
    @Expose({name: "buyType"})
    buyType(){
        return this.buy_type;
    }

    price: number;

    @Exclude()
    land_size: number;
    @Expose({name:'landSize'})
    landSize(){
        return this.land_size;
    }

    city: string;

    @Exclude()
    created_at: Date;
    @Expose({name: "createdAt"})
    createdAt(){
        return this.created_at
    }

    @Exclude()
    updated_at: Date;
    @Expose({name: "updatedAt"})
    updatedAt(){
        return this.updated_at;
    }
    user_id: string;


    constructor(partial: Partial<HomeResponseDto>) {
        Object.assign(this, partial);
    }
}

class Image {
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    url: string
}

export class CreateHomeDto{
    @IsString()
    @IsNotEmpty()
    address: string;

    @IsNumber()
    @IsPositive()
    landSize: number;

    @IsNumber()
    @IsPositive()
    numberOfBathrooms: number;

    @IsNumber()
    @IsPositive()
    numberOfBedrooms: number;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsArray()
    @ValidateNested({each: true})
    @Type(()=> Image)
    images: Image[]

    @IsEnum(PROPERTYTYPE)
    type: PROPERTYTYPE

    @IsString()
    @IsNotEmpty()
    city: string

    @IsEnum(BUYCATEGORY)
    buyType: BUYCATEGORY
}

export class UpdateHomeDto{
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    address?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    landSize?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    numberOfBathrooms?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    numberOfBedrooms?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    price?: number;

    @IsOptional()
    @IsEnum(PROPERTYTYPE)
    type?: PROPERTYTYPE

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    city?: string

    @IsOptional()
    @IsEnum(BUYCATEGORY)
    buyType?: BUYCATEGORY
}

export interface HomeFilters {
    city?: string
    number_of_bedrooms?: number;
    number_of_bathrooms?: number;
    type?:PROPERTYTYPE
    price?:{
        gte?: number;
        lte?: number
    }
}


export class HomeSearchQueryDto {
    @IsOptional()
    @IsPositive()
    @IsNumber()
    maxPrice?: number;
  
    @IsOptional()
    @IsPositive()
    @IsNumber()
    minPrice?: number;
  
    @IsOptional()
    @IsPositive()
    @IsNumber()
    numberOfBedrooms?: number;
  
    @IsOptional()
    @IsPositive()
    @IsNumber()
    numberOfBathrooms?: number;
  
    @IsOptional()
    @IsEnum(PROPERTYTYPE)
    type?: PROPERTYTYPE;
  
    @IsOptional()
    @IsString()
    city?: string;
  }
  