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
    let iaResponse: any;
    const messages = request?.entry?.[0]?.changes?.[0]?.value?.messages || [];

    if (!messages) return;

    const message = messages[0];
    const messageFrom = message?.from;
    const text = message?.text.body;

    if (messages.length > 0) {
      iaResponse = await this.geminiService.generateAIResponse(text);
    }

    const url = `https://graph.facebook.com/${process.env.WHATSAPP_CLOUD_API_VERSION}/${process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID}/messages`;

    const config = {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    let fromFormated: any;

    if (messageFrom?.charAt(2) === '9') {
      console.log(messageFrom);
      fromFormated = messageFrom.slice(0, 2) + messageFrom.slice(3);
      console.log(fromFormated);
    }

    const data = {
      messaging_product: 'whatsapp',
      to: fromFormated,
      type: 'text',
      text: {
        preview_url: false,
        body: iaResponse,
      },
    };

    try {
      let response = this.httpService.post(url, data, config).pipe(
        map((res) => {
          return res.data;
        }),
        catchError((error) => {
          throw new BadRequestException('Error posting to WhatsApp Cloud API');
        }),
      );
      return response;
    } catch (error) {
      return 'Error';
    }
  }
}
