import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { getPriority } from 'os';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateBookingDto, @Request() req) {
    return this.bookingsService.create(req.user.userId, dto);
  }

  @Post(':id/pay')
  payOrder(@Param('id') id: string) {
    return this.bookingsService.payOrder(+id);
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  getPriority(@Param('id') id: string) {
    return this.bookingsService.getOrder(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(+id, updateBookingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/cancel')
  cancelOrder(@Request() req, @Param('id') id: string) {
    return this.bookingsService.cancelOrder(req.user.userId, +id);
  }
}
