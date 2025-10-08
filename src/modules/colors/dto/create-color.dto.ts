import { IsString, MaxLength, IsHexColor } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateColorDto {
  @ApiProperty({ description: 'Name of the color', example: 'Green' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: 'Hexadecimal code of the color', example: '#00FF00' })
  @IsString()
  @IsHexColor()
  hexCode: string;
}