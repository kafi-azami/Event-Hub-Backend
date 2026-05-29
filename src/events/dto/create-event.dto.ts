import{ IsString, IsNotEmpty, IsDateString, IsInt, IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateEventDto {
    @IsNotEmpty()
    @ApiProperty()
    title!: string;

    @IsNotEmpty()
    @ApiProperty()
    description!: string;

    @IsDateString()
    date!: string;

    @IsNotEmpty()
    location!: string;

    @IsInt()
    price!: number;

    @IsString()
    slug!: string;

    @IsString()
    category!: string;

    @IsString()
    categoryColor!: string;

    @IsString()
    organizer!: string;

    @IsString()
    imageColor!: string;

    @IsNumber()
    availableSeats!: number;

    @IsNumber()
    totalSeats!: number;

    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;
}
