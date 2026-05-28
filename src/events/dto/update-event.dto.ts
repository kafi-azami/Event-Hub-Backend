import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class UpdateEventDto {
     @IsOptional()
     title?: string;

     @IsOptional()
     description?: string;

     @IsOptional()
     @IsDateString()
     date?: string;

     @IsOptional()
     location?: string;

     @IsOptional()
     @IsInt()
     price?: number;
}
