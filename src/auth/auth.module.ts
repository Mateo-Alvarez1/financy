import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SessionSerializer } from './utils/serializer';
import { ChannelModule } from 'src/channel/channel.module';
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    SessionSerializer,

    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
  imports: [ConfigModule, TypeOrmModule.forFeature([User]), ChannelModule],
})
export class AuthModule {}
