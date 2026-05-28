import{ IsString, IsNotEmpty, IsDateString, IsInt } from 'class-validator';
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
}
