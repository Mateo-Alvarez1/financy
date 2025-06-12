import { Module } from '@nestjs/common';
import { GeminiAgentService } from './gemini-agent.service';

@Module({
  controllers: [],
  providers: [GeminiAgentService],
  exports: [GeminiAgentService],
})
export class GeminiAgentModule {}
