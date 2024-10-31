import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { CreateHomeDto, HomeFilters, HomeResponseDto, UpdateHomeDto } from './dtos/home.dto';
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
        return new HomeResponseDto(await this.prismaService.home.findUnique({
            where: { id },
            select: {
                ...selectHomeQuery,
                images: {
                    select: {
                        url: true,
                    }
                }
            }
        }))
    }

    async createHome({ address, buyType, city, images, landSize, numberOfBathrooms, numberOfBedrooms, price, type }: CreateHomeDto) {
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
                user_id: "b1d7e532-31cd-42ba-8dc3-cd446ffa0f99"
            }
        })
        const newLyCreateImages = await this.prismaService.image.createMany({
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

    async updateHome(id: string , data : UpdateHomeDto) {
        const tobeupdatedHome = await this.prismaService.home.findUnique({where:{id}});
        if(!tobeupdatedHome){
            throw new NotFoundException()
        }
        const updatedhome = await this.prismaService.home.update({data,where:{id}})
        console.log({updatedhome})
        return updatedhome
    }

    async deleteHome() {
    }
}
