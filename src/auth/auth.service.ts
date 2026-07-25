import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { RegisterRiderDto } from './dto/register-rider.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    // 1. Customer registration service
    async registerCustomer(dto: RegisterCustomerDto) {
        const existingUser = await this.usersService.findByIdentity(dto.email);
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        const existingPhone = await this.usersService.findByIdentity(dto.phone);
        if (existingPhone) {
            throw new BadRequestException('User with this phone number already exists');
        }

        // Hash password before saving to PostgreSQL (cost rounds = 10)
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.usersService.createCustomer({
            ...dto,
            password: hashedPassword,
        });

        const { password, ...result } = user;
        return {
            message: 'Customer registered successfully',
            user: result,
        };
    }

    // 2. Rider registration service (expects Multer file payload)
    async registerRider(dto: RegisterRiderDto, file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('NID image file upload is required');
        }

        const existingUser = await this.usersService.findByIdentity(dto.email);
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        const existingPhone = await this.usersService.findByIdentity(dto.phone);
        if (existingPhone) {
            throw new BadRequestException('User with this phone number already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const rider = await this.usersService.createRider(
            {
                name: dto.name,
                email: dto.email,
                phone: dto.phone,
                password: hashedPassword,
            },
            dto.nidNumber,
            file.path,
        );

        const { password, ...result } = rider;
        return {
            message: 'Rider registered successfully. Verification status: Pending Admin Approval',
            rider: result,
        };
    }

    // 3. Authenticate user & sign JWT token
    async login(dto: LoginDto) {
        const user = await this.usersService.findByIdentity(dto.identity);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Your account has been suspended by an administrator');
        }

        // Compare plain-text password with hashed database password
        const isPasswordMatched = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordMatched) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Token payload contains: Subject (user id), Email, User Role, and Rider Verification status
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            riderVerification: user.riderVerification ? { status: user.riderVerification.status } : undefined,
        };
        const accessToken = this.jwtService.sign(payload);

        return {
            message: 'Login successful',
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
}
