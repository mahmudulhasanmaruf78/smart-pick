import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { RegisterRiderDto } from './dto/register-rider.dto';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // 1. Customer registration endpoint
    @Post('register-customer')
    async registerCustomer(@Body() dto: RegisterCustomerDto) {
        return await this.authService.registerCustomer(dto);
    }

    // 2. Rider registration endpoint with Multer NID image upload
    @Post('register-rider')
    @UseInterceptors(
        FileInterceptor('nidImage', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    callback(null, `nid-${uniqueSuffix}${ext}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/i)) {
                    return callback(
                        new BadRequestException('Only image files (jpg, jpeg, png) or PDF are allowed!'),
                        false,
                    );
                }
                callback(null, true);
            },
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB limit
            },
        }),
    )

}
