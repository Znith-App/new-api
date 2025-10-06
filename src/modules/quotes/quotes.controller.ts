import { Controller, Get } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('quotes')
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Returns a daily quote.' })
  async getDailyQuotes() {
    const quote = await this.quotesService.getTodayQuote();

    const response: any = { original: { text: quote.text, author: quote.author } };
    for (const t of quote.translations) {
      response[t.language.toLowerCase()] = { text: t.text, author: quote.author };
    }

    return response;
  }
}