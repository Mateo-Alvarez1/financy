import { Module } from '@nestjs/common';
import { ChannelModule } from './channel/channel.module';
import { GeminiAgentModule } from './gemini-agent/gemini-agent.module';

@Module({
  imports: [ChannelModule, GeminiAgentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
