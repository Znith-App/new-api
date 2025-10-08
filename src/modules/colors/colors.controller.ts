import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorDto } from './dto/create-color.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorators';

@ApiTags('Admin - Colors')
@Controller('admin/colors')
@UseGuards(AuthGuard)
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new color (Admin only)' })
  @ApiBody({ type: CreateColorDto })
  @ApiBearerAuth()
  create(@Body() dto: CreateColorDto) {
    return this.colorsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all colors' })
  findAll() {
    return this.colorsService.findAll();
  }
}
