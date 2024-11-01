import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { CreateHomeDto, HomeFilters, HomeResponseDto, UpdateHomeDto } from './dtos/home.dto';
import { TokenUserInterface } from 'src/GlobalInterceptor/Userinterceptor.Interceptor';
const selectHomeQuery = {
    address: true,
    buy_type: true,
    city: true,
    listed_date: true,
    created_at: true,
    number_of_bathrooms: true,
    number_of_bedrooms: true,
    id: true,
    land_size: true,
    price: true,
    type: true,
    updated_at: true,
    user_id: true,
}
@Injectable()
export class HomeService {
    constructor(private readonly prismaService: PrismaService) { }
    async getHomes(filter: HomeFilters) {
        const homes = await this.prismaService.home.findMany({
            select: {
                ...selectHomeQuery,
                images: {
                    select: {
                        url: true,
                    },
                    take: 1,
                },
            },
            where: filter
        });
        return homes.map(home => {
            const imageUrl = home.images?.[0]?.url || "";
            delete home.images;
            return new HomeResponseDto({ ...home, image: imageUrl })
        });
    }

    async getHomeById(id: string) {
        const home = await this.prismaService.home.findUnique({
            where: { id },
            select: {
                ...selectHomeQuery,
                images: {
                    select: {
                        url: true,
                    }
                }
            }
        });
        if(!home){
            throw new NotFoundException()
        }
        return new HomeResponseDto(home);
    }

    async createHome({ address, buyType, city, images, landSize, numberOfBathrooms, numberOfBedrooms, price, type }: CreateHomeDto, loggedInUser: TokenUserInterface) {
        const newHome = await this.prismaService.home.create({
            data: {
                address,
                buy_type: buyType,
                city,
                land_size: landSize,
                number_of_bathrooms: numberOfBathrooms,
                number_of_bedrooms: numberOfBedrooms,
                price,
                type,
                user_id: loggedInUser.id,
            }
        })
        await this.prismaService.image.createMany({
            data: images?.map(image => {
                return {
                    url: image.url,
                    description: newHome.address + newHome.id,
                    home_id: newHome.id
                }
            })
        })
        return new HomeResponseDto({ ...newHome, image: images[0].url });
    }

    async updateHome(id: string , data : UpdateHomeDto, loggedInUserId: string) {
        const tobeupdatedHome = await this.prismaService.home.findUnique({where:{id}});
        if(!tobeupdatedHome){
            throw new NotFoundException()
        }
        if(loggedInUserId !== tobeupdatedHome.user_id){
            throw new UnauthorizedException();
        }
        const updatedhome = await this.prismaService.home.update({data,where:{id}})
        return new HomeResponseDto(updatedhome)
    }

    async deleteHome(id: string, loggedInUserId: string) {
        const tobeDeletedHome = await this.prismaService.home.findUnique({where:{id}});
        if(!tobeDeletedHome){
            throw new NotFoundException();
        }
        if(tobeDeletedHome.user_id !== loggedInUserId){
            throw new UnauthorizedException();
        }
        await this.prismaService.home.delete({where:{id}});
        return;
    }
}
