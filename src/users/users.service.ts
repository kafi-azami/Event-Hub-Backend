import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    findByEmail(email: string) {
        return this.prisma.client.user.findUnique({
            where: { email},
        })
    }

    createUser(data: any) {
        return this.prisma.client.user.create({
            data,
        })
    }

    findAll() {
        return this.prisma.client.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
    }
}
