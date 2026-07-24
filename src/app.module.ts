import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZonesModule } from './zones/zones.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ZonesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
