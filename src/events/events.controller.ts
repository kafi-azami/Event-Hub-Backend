import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {

    storage: diskStorage({

      destination: './uploads',

      filename: (req, file, cb) => {

        const uniqueName =
          Date.now() +
          extname(file.originalname);

        cb(null, uniqueName);
      },
    }),
  }),
  )

  uploadBanner(
  @UploadedFile() file: Express.Multer.File,
  ) {

  return {
    imageUrl: file.filename,
  };

  }

  @ApiOperation({ summary: 'Get all events' })
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.eventsService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search: search || '',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Get(':id/seats')
  getSeats(@Param('id') id: string) {
    return this.eventsService.getSeats(+id);
  }

  @Get(':id/seat-status')
  getSeatStatus(@Param('id') id: string) {
    return this.eventsService.getSeatStatus(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
