import { PartialType } from '@nestjs/mapped-types';
import { CreatePsychotherapyDto } from './create-psychotherapy.dto';

export class UpdatePsychotherapyDto extends PartialType(CreatePsychotherapyDto) {}