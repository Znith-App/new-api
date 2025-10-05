import { IsInt, IsString, Length } from 'class-validator';

export class Verify2FADto {
  @IsString()
  tempToken: string;

  @IsString()
  @Length(6, 6, { message: 'Code must have 6 digits' })
  code: string;
}
