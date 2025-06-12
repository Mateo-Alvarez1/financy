import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Request } from 'express';

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
