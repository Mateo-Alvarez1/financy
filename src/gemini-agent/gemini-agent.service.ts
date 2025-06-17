import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiAgentService {
  // QUE TENGA CONEXION CON GOOGLE CALENDAR --> AGENDADOR Y RECORDADOR DE EVENTOS
  private readonly geminiAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  async generateAIResponse(userInput: string): Promise<string> {
    const today = new Date().toLocaleDateString('es-AR');
    try {
      const result = await this.geminiAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Actuá como un asistente financiero automatizado para WhatsApp.

Vas a recibir dos tipos de mensajes:
1. Mensajes financieros como "Gaste 15000 en carnicería", "Ingresé 20000 de sueldo", etc.
2. Mensajes conversacionales como "Hola", "¿Cómo estás?", "Gracias", etc.

Tu tarea es:

➡️ Si el mensaje es financiero:
- Detectar si es un ingreso o un gasto.
- Devolver un texto con el detalle del gasto/ingreso , NO HABLAR NI DAR UN MENSAJE CONVERSACIONAL
- Extraer el monto y la categoría.
- Devolver un JSON con la siguiente estructura estricta:

{
  "values": [
    [${today} "tipo", monto, "categoría"]
  ]
}
- Em caso de no identificar claramente la categoria , poner "otro"

➡️ Si el mensaje es conversacional (no tiene relación con finanzas):
     - Contestá de forma cálida, humana y empática. Podés dar palabras de aliento, consejos de vida, hacer preguntas o simplemente acompañar emocionalmente.
     - No respondas con JSON, hablá como una persona que quiere ayudar.

📌 No expliques lo que hacés, simplemente respondé según el tipo de mensaje.

Ahora procesá este mensaje:
${userInput}`,
      });

      const response =
        result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      console.log(response);

      return response || '';
    } catch (error) {
      return 'Ocurrió un error al generar la respuesta.';
    }
  }
}
