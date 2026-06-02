import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) { }

  async create(userId: number, dto: CreateBookingDto) {
    return this.prisma.client.$transaction(async (tx) => {
      const seats = await tx.seat.findMany({
        where: { id: { in: dto.seatIds }, eventId: dto.eventId }
      })

      if (seats.length !== dto.seatIds.length) {
        throw new BadRequestException('Some seats not found');
      }

      const bookedSeat = seats.find(
        (seat) => seat.status === 'BOOKED'
      )
      if (bookedSeat) {
        throw new BadRequestException(
          `Seat ${bookedSeat.seatNumber} is already booked`
        );
      }

      const event = await tx.event.findUnique({
        where: { id: dto.eventId }
      })
      if (!event) {
        throw new BadRequestException('Event not found');
      }

      const totalPrice = event.price * dto.seatIds.length;

      const order = await tx.order.create({
        data: {
          invoiceCode: randomUUID(),
          userId: userId,
          eventId: dto.eventId,
          totalPrice,
        }
      })

      await tx.seat.updateMany({
        where: { id: { in: dto.seatIds } },
        data: { status: 'BOOKED', }
      })

      const ticketsData = dto.seatIds.map((seatId) => ({
        orderId: order.id,
        seatId,
        qrCode: randomUUID(),
      }))

      await tx.ticket.createMany({
        data: ticketsData,
      })
      return {
        message: 'Booking successful',
        orderId: order.id,
        totalPrice,
      }
    })
  }

  async payOrder(orderId: number) {

    const order = await this.prisma.client.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.paymentStatus === 'PAID') {
      throw new BadRequestException('Order already paid');
    }

    await this.prisma.client.order.update({
      where: {
        id: orderId,
      },

      data: {
        paymentStatus: 'PAID',
      },
    });

    return {
      message: 'Payment success',
    };
  }

  async getOrder(orderId: number) {

    return this.prisma.client.order.findUnique({
      where: {
        id: orderId,
      },

      include: {
        event: true,

        tickets: {
          include: {
            seat: true,
          },
        },

        user: true,
      },
    });
  }

  async getDashboardStats() {
    const totalRevenue = await this.prisma.client.order.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: {
        paymentStatus: 'PAID',
      },
    });

    const ticketsSold = await this.prisma.client.ticket.count();

    const activeEvents = await this.prisma.client.event.count();

    const totalUsers = await this.prisma.client.user.count();

    return {
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      ticketsSold,
      activeEvents,
      totalUsers,
    };
  }

  async findAllBookings() {
    return this.prisma.client.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },

        event: true,

        tickets: {
          include: {
            seat: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async cancelOrder(
    userId: number,
    orderId: number,
  ) {

    return this.prisma.client.$transaction(
      async (tx) => {

        const order =
          await tx.order.findUnique({

            where: {
              id: orderId,
            },

            include: {
              tickets: true,
            },
          });

        if (!order) {

          throw new BadRequestException(
            'Order not found',
          );
        }

        if (order.userId !== userId) {

          throw new BadRequestException(
            'Unauthorized access',
          );
        }

        if (
          order.paymentStatus === 'CANCELLED'
        ) {

          throw new BadRequestException(
            'Order already cancelled',
          );
        }

        const usedTicket =
          await tx.ticket.findFirst({

            where: {
              orderId,
              isUsed: true,
            },
          });

        if (usedTicket) {

          throw new BadRequestException(
            'Cannot cancel used ticket',
          );
        }

        const seatIds =
          order.tickets.map(
            (ticket) => ticket.seatId,
          );

        await tx.seat.updateMany({

          where: {
            id: {
              in: seatIds,
            },
          },

          data: {
            status: 'AVAILABLE',
          },
        });

        await tx.ticket.deleteMany({

          where: {
            orderId,
          },
        });

        await tx.order.update({

          where: {
            id: orderId,
          },

          data: {
            paymentStatus: 'CANCELLED',
          },
        });

        return {
          message:
            'Booking cancelled successfully',
        };

      },
    );

  }

  async findAll(userId: number) {
    return this.prisma.client.order.findMany({
      where: { userId },
      include: {
        event: true,
        tickets: {
          include: {
            seat: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
