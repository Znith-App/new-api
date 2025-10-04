import { IsString, IsEmail, IsDateString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsDateString()
  birthDate: string; 
  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
