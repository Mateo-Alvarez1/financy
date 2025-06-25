import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Request } from 'express';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get('webhook')
  testConnection(@Req() request: Request) {
    return this.channelService.testConnection(request);
  }

  @Post('webhook')
  async handleIncomingMessages(@Body() request: any) {
    return this.channelService.handleMessages(request);
  }
}
