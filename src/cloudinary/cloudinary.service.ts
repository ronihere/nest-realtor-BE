import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { TCloudinaryImageUpload } from './dto/cloudinary.dto';

@Injectable()
export class CloudinaryService {
    constructor(private readonly configService : ConfigService){}
    private readonly cloudinaryClient = cloudinary.config({
        cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
        api_key: this.configService.get('CLOUDINARY_API_KEY'),
        api_secret: this.configService.get('CLOUDINARY_API_SECRET')
    });
    async imageUpload(filename: string, file: Buffer, folder: string): Promise<TCloudinaryImageUpload>{
        const uploadOptions = {
            folder,
            public_id: filename,
            use_filename: true, // optional, default is false
            unique_filename: false // optional, default is true
          };
        const result = new Promise((resolve) => {
            cloudinary.uploader.upload_stream(uploadOptions,(error, uploadResult) => {
                return resolve(uploadResult);
            }).end(file);
        }).then((uploadResult) => {
            console.log(`Buffer upload_stream wth promise success - ${JSON.stringify(uploadResult)}`);
            return uploadResult;
        });
        return result as Promise<TCloudinaryImageUpload>;
    }
}
