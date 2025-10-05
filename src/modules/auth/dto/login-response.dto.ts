import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5...' })
  token?: string;

  @ApiPropertyOptional({ example: true })
  need2fa?: boolean;

  @ApiPropertyOptional({ example: 'temp_3f8a9d1e' })
  tempToken?: string;

  @ApiProperty({
    example: { id: 1, email: 'user@email.com', is2FAEnabled: false },
  })
  user?: any;
}
