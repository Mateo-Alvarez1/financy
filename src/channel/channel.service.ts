import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { catchError, lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { GeminiAgentService } from 'src/gemini-agent/gemini-agent.service';
@Injectable()
export class ChannelService {
  constructor(
    private readonly httpService: HttpService,
    private readonly geminiService: GeminiAgentService,
  ) {}

  testConnection(request: Request) {
    const mode = request.query['hub.mode'];
    const challenge = request.query['hub.challenge'];
    const token = request.query['hub.verify_token'];

    const verificationToken =
      process.env.WHATSAPP_CLOUD_API_WEBHOOK_VERIFICATION_TOKEN;

    if (!mode || !token) {
      return 'Error verify token';
    }

    if (mode === 'subscribe' && token === verificationToken) {
      return challenge?.toString();
    }
  }

  async handleMessages(request: any) {
    const messages = request?.entry?.[0]?.changes?.[0]?.value?.messages || [];
    if (!messages.length) return;

    const message = messages[0];
    if (!message?.text || message?.type !== 'text') return;
    const messageFrom = message?.from;
    const text = message?.text.body;

    const iaResponse = await this.geminiService.generateAIResponse(text);

    return this.sendMessage(messageFrom, iaResponse);
  }

  async sendMessage(to: string, text: string) {
    const url = `https://graph.facebook.com/${process.env.WHATSAPP_CLOUD_API_VERSION}/${process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID}/messages`;

    const config = {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    let fromFormatted = to;
    if (to.charAt(2) === '9') {
      fromFormatted = to.slice(0, 2) + to.slice(3);
    }

    const data = {
      messaging_product: 'whatsapp',
      to: fromFormatted,
      type: 'text',
      text: {
        preview_url: false,
        body: text,
      },
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, data, config).pipe(
          map((res) => res.data),
          catchError((error) => {
            console.error(
              'Error posting to WhatsApp Cloud API:',
              error?.response?.data || error.message,
            );
            throw new BadRequestException(
              'Error posting to WhatsApp Cloud API',
            );
          }),
        ),
      );
      return response;
    } catch (error) {
      console.error('Catch general error:', error);
      return 'Error';
    }
  }
}
