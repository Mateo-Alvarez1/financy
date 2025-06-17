import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  imports: [ConfigModule, TypeOrmModule.forFeature([User])],
})
export class AuthModule {}
