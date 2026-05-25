import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    const event = await this.prisma.client.event.create({
      data: {
        title: createEventDto.title,
        description: createEventDto.description,
        date: new Date(createEventDto.date),
        location: createEventDto.location,
        price: createEventDto.price,
      }
    })
    const seats: {
      seatNumber: string;
      eventId: number;
    }[] = [];
    const rows = ['A', 'B', 'C', 'D']
    for (const row of rows) {
      for (let i = 1; i <= 10; i++) {
        seats.push({
          seatNumber: `${row}${i}`,
          eventId: event.id,
        });
      }
    }
    await this.prisma.client.seat.createMany({
      data: seats,
    })
    return {
      message: 'Event created successfully',
      event,
    }
  }

  async getSeatStatus(eventId: number) {
    const total = await this.prisma.client.seat.count({
      where: { eventId }
    })
    const booked = await this.prisma.client.seat.count({
      where: { eventId, status: 'BOOKED' }
    })
    const available = total - booked;
    return {
      total,
      booked,
      available,
    }
  }

  findAll() {
    return this.prisma.client.event.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    })
  }

  findOne(id: number) {
    return this.prisma.client.event.findUnique({
      where: {
        id,
      },
      include: {
        seats: true,
      }
    })
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
