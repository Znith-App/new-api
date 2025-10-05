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
    const original = await this.quotesService.getRandomQuote();

    const pt = await this.quotesService.translate(original.text, 'PT');

    const es = await this.quotesService.translate(original.text, 'ES');

    return {
      original: {
        text: original.text,
        author: original.author,
      },
      pt: {
        text: pt,
        author: original.author,
      },
      es: {
        text: es,
        author: original.author,
      },
    };
  }
}