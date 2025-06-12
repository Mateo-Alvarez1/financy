import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { HttpModule } from '@nestjs/axios';
import { GeminiAgentModule } from 'src/gemini-agent/gemini-agent.module';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService],
  imports: [HttpModule, GeminiAgentModule],
})
export class ChannelModule {}
