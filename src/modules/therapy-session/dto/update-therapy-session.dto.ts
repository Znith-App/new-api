import { PartialType } from '@nestjs/mapped-types';
import { CreateTherapySessionDto } from './create-therapy-session.dto';

export class UpdateTherapySessionDto extends PartialType(CreateTherapySessionDto) {}