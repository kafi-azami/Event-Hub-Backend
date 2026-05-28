import { IsArray, IsInt, ArrayNotEmpty} from 'class-validator';
export class CreateBookingDto {
    @IsInt()
    eventId!: number;

    @IsArray()
    @ArrayNotEmpty()
    seatIds!: number[];
}
