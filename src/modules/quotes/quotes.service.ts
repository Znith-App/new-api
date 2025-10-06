import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class QuotesService {
  private readonly logger = new Logger(QuotesService.name);
  private readonly zenQuotesUrl = 'https://zenquotes.io/api/random';
  private readonly libreTranslateUrl ='http://localhost:5000';

  constructor(private readonly prisma: PrismaService) {}

  async getRandomQuote(): Promise<{ text: string; author: string }> {
    const response = await axios.get(this.zenQuotesUrl);
    const quote = response.data[0];
    return { text: quote.q, author: quote.a };
  }

  async translate(text: string, targetLang: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.libreTranslateUrl}/translate`,
        {
          q: text,
          source: 'auto',
          target: targetLang.toLowerCase(),
          format: 'text',
        },
        { headers: { 'Content-Type': 'application/json' } },
      );
      return response.data.translatedText;
    } catch (error) {
      this.logger.error(`Erro ao traduzir para ${targetLang}: ${error.message}`);
      return text;
    }
  }

  async saveDailyQuote(): Promise<any> {
    const original = await this.getRandomQuote();

    const pt = await this.translate(original.text, 'PT');
    const es = await this.translate(original.text, 'ES');
    const fr = await this.translate(original.text, 'FR');

    const dailyQuote = await this.prisma.dailyQuote.create({
      data: {
        text: original.text,
        author: original.author,
        translations: {
          create: [
            { language: 'PT', text: pt },
            { language: 'ES', text: es },
            { language: 'FR', text: fr },
          ],
        },
      },
      include: { translations: true },
    });

    return dailyQuote;
  }

  async getTodayQuote(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let quote = await this.prisma.dailyQuote.findFirst({
      where: { createdAt: { gte: today } },
      include: { translations: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!quote) {
      quote = await this.saveDailyQuote();
    }

    return quote;
  }
}