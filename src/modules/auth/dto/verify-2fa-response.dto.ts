import { ApiProperty } from '@nestjs/swagger';

export class Verify2FAResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5...' })
  token: string;

  @ApiProperty({
    example: { id: 1, email: 'user@email.com', name: 'John Doe' },
  })
  user: any;
}
