import{ IsString, IsNotEmpty, IsDateString, IsInt } from 'class-validator';
export class CreateEventDto {
    @IsNotEmpty()
    title!: string;

    @IsNotEmpty()
    description!: string;

    @IsDateString()
    date!: string;

    @IsNotEmpty()
    location!: string;

    @IsInt()
    price!: number;
}
