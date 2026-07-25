import {
  Injectable,
  OnModuleInit,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/common/enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    const adminExists = await this.usersRepo.findOne({
      where: { role: Role.Admin },
    });

    if (!adminExists) {
      const hashPassword = await bcrypt.hash('admin123', 10);
      const adminUser = this.usersRepo.create({
        name: 'System Admin',
        email: 'admin@smartpick.com',
        phone: '01700000000',
        password: hashPassword,
        role: Role.Admin,
        isActive: true,
      });
      await this.usersRepo.save(adminUser);
      console.log('Admin user created successfully');
    }
  }

  async findProfile(userId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.findProfile(userId);

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.phone) {
      user.phone = updateUserDto.phone;
    }

    if (updateUserDto.email) {
      const existingUser = await this.usersRepo.findOne({
        where: { email: updateUserDto.email, id: Not(userId) },
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
      user.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return await this.usersRepo.save(user);
  }

  async suspendUser(userId: number) {
    const user = await this.findProfile(userId);
    user.isActive = false;
    return this.usersRepo.save(user);
  }

  async findAllUsers() {
    return this.usersRepo.find();
  }
}
