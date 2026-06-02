import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { getPriority } from 'os';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../common/roles.decorator';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateBookingDto, @Request() req) {
    return this.bookingsService.create(req.user.userId, dto);
  }

  @ApiBearerAuth()
  @Post(':id/pay')
  payOrder(@Param('id') id: string) {
    return this.bookingsService.payOrder(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  findAllBookings() {
    return this.bookingsService.findAllBookings();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.bookingsService.findAll(req.user.userId);
  }

  @Get(':id')
  getPriority(@Param('id') id: string) {
    return this.bookingsService.getOrder(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(+id, updateBookingDto);
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/cancel')
  cancelOrder(@Request() req, @Param('id') id: string) {
    return this.bookingsService.cancelOrder(req.user.userId, +id);
  }
}
