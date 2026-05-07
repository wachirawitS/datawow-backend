import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@ApiTags('reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Reserve a seat (User only, 1 per concert)' })
  @ApiResponse({ status: 201, description: 'Reservation created' })
  @ApiResponse({ status: 409, description: 'Already reserved or fully booked' })
  reserve(@CurrentUser() user: JwtPayload, @Body() dto: CreateReservationDto) {
    return this.reservationsService.reserve(user.sub, dto);
  }

  @Delete(':id')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Cancel a reservation (User only)' })
  @ApiResponse({ status: 200, description: 'Reservation cancelled' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  cancel(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.reservationsService.cancel(user.sub, id);
  }

  @Get('mine')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Get my reservation history (User only)' })
  getMyReservations(@CurrentUser() user: JwtPayload) {
    return this.reservationsService.findMyReservations(user.sub);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all reservations audit trail (Admin only)' })
  findAll() {
    return this.reservationsService.findAll();
  }
}
