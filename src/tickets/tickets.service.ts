import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as QRCode from 'qrcode';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}
  
  async getTicket(ticketId: number) {
    const ticket = await this.prisma.client.ticket.findUnique({
      where: {
        id: ticketId,
      },
      include: {
        seat: true,
        order: {
          include: {
            event: true,
            user: true,
          }
        }
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const qrPayload = JSON.stringify({
      ticketId: ticket.id,
      orderId: ticket.orderId,
    })

    const qrImage = await QRCode.toDataURL(qrPayload);
    return {
      ticket,
      qrImage,
    }
  }

  async getMyTickets(userId: number) {
    return this.prisma.client.ticket.findMany({
      where: {
        order: {
          userId,
        }
      },
      include: {
        seat: true,
        order: {
          include: {
            event: true,
          }
        }
      },
      orderBy: {
        id: 'desc',
      }
    })
  }

  async scanTicket(qrCode: string) {

  const ticket =
    await this.prisma.client.ticket.findUnique({

      where: {
        qrCode,
      },

      include: {
        seat: true,

        order: {
          include: {
            event: true,
            user: true,
          },
        },
      },
    });

  // INVALID TICKET

  if (!ticket) {

    throw new NotFoundException(
      'Invalid ticket',
    );
  }

  // UNPAID CHECK

  if (
    ticket.order.paymentStatus !== 'PAID'
  ) {

    throw new BadRequestException(
      'Ticket not paid',
    );
  }

  // USED CHECK

  if (ticket.isUsed) {

    throw new BadRequestException(
      'Ticket already used',
    );
  }

  // UPDATE USED

  await this.prisma.client.ticket.update({

    where: {
      id: ticket.id,
    },

    data: {
      isUsed: true,
    },
  });

  return {
    message: 'Ticket valid',

    ticket: {
      id: ticket.id,

      seat: ticket.seat.seatNumber,

      user: ticket.order.user.name,

      event: ticket.order.event.title,
    },
  };
  } 

  create(createTicketDto: CreateTicketDto) {
    return 'This action adds a new ticket';
  }

  findAll() {
    return `This action returns all tickets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
