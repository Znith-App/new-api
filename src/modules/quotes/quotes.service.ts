import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class QuotesService {
  private readonly logger = new Logger(QuotesService.name);
  private readonly zenQuotesUrl = 'https://zenquotes.io/api/random';
  private readonly libreTranslateUrl ='https://libretranslate.com';

  constructor() {}

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
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.translatedText;
    } catch (error) {
      this.logger.error(`Erro ao traduzir para ${targetLang}: ${error.message}`);
      return text;
    }
  }

  async getQuoteTranslated(targetLang: string): Promise<{ text: string; author: string }> {
    const quote = await this.getRandomQuote();
    const translatedText = await this.translate(quote.text, targetLang);
    return { text: translatedText, author: quote.author };
  }
}
