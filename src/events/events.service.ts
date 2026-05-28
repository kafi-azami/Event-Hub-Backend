import { BadRequestException, Injectable } from '@nestjs/common';
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

  async getSeats(eventId: number) {

  return this.prisma.client.seat.findMany({
    where: {
      eventId,
    },

    orderBy: {
      seatNumber: 'asc',
    },
  });

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

  async findAll(query: { page: number; limit: number; search: string }) {
    const skip = (query.page - 1) * query.limit;
    const events = await this.prisma.client.event.findMany({
      where: {
        title: {
          contains: query.search,
        }
      },
      include: {
        seats: true,
      },
      skip,
      take: query.limit,
      orderBy: {
        createdAt: 'desc',
      }
    })

    const total =  await this.prisma.client.event.count({
      where: {
        title: {
          contains: query.search,
        }
      }
    });

    return { data: events, meta: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    }}
  }

  async findOne(id: number) {
    const event = await this.prisma.client.event.findUnique({
      where: { id },
      include: {
        seats: true,
      }
    })
    if (!event) {
      throw new BadRequestException('Event not found');
    }
    const totalSeats = event.seats.length;
    const bookedSeats = event.seats.filter((seat) => seat.status === 'BOOKED').length;

    return {
      ...event,
      saetStatus: {
        total: totalSeats,
        booked: bookedSeats,
        available: totalSeats - bookedSeats
      }
    }
  }

  async update(id: number,dto: UpdateEventDto) {
    const event = await this.prisma.client.event.findUnique({
      where: { id },
    })

    if (!event) {
      throw new BadRequestException('Event not found');
    }

    return this.prisma.client.event.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        date: dto.date
        ? new Date(dto.date)
        : undefined,
        location: dto.location,
        price: dto.price,
      }
    })
  }

  async remove(id: number) {
    const event = await this.prisma.client.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new BadRequestException('Event not found');
    }

    await this.prisma.client.ticket.deleteMany({
      where: { seat: { eventId: id } },
    })

    await this.prisma.client.order.deleteMany({
      where: { eventId: id },
    })

    await this.prisma.client.seat.deleteMany({
      where: { eventId: id },
    })

    await this.prisma.client.event.delete({
      where: { id} ,
    })

    return {
      message: 'Event deleted successfully',
    }
  }
}
