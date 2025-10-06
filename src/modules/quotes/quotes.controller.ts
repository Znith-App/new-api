import { Controller, Get, Param } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('quotes')
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Returns a daily quote and save it in the database.' })
  async getDailyQuotes() {
    const quote = await this.quotesService.getTodayQuote();

    const response: any = { original: { text: quote.text, author: quote.author } };
    for (const t of quote.translations) {
      response[t.language.toLowerCase()] = { text: t.text, author: quote.author };
    }

    return response;
  }

  @Get()
  @ApiOperation({ summary: 'Returns all saved quotes.' })
  async getAllQuotes() {
    return this.quotesService.getAllQuotes();
  }

  @Get('/latest-quote')
  @ApiOperation({ summary: 'Returns the most recently saved quote.' })
  async getLatestQuote() {
    return this.quotesService.getLastQuote();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns a quote by its ID.' })
  async getQuoteById(@Param('id') id: string) {
    return this.quotesService.getQuoteById(Number(id));
  }
}