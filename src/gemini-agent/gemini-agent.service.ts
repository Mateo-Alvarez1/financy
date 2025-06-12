import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiAgentService {
  private readonly geminiAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  async generateAIResponse(userInput: string): Promise<string> {
    try {
      const result = await this.geminiAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: userInput,
      });

      const response = result?.candidates?.[0]?.content?.parts?.[0]?.text
        ?.trim()
        .toLowerCase();

      console.log(response);

      return response || '';
    } catch (error) {
      return 'Ocurrió un error al generar la respuesta.';
    }
  }
}
