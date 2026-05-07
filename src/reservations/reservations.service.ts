import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { Concert } from '../concerts/entities/concert.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    @InjectRepository(Concert)
    private readonly concertsRepository: Repository<Concert>,
    private readonly dataSource: DataSource,
  ) {}

  async reserve(userId: string, dto: CreateReservationDto): Promise<Reservation> {
    return this.dataSource.transaction(async (manager) => {
      const concert = await manager.findOne(Concert, {
        where: { id: dto.concertId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!concert) throw new NotFoundException('Concert not found');

      const existing = await manager.findOne(Reservation, {
        where: { userId, concertId: dto.concertId, status: ReservationStatus.ACTIVE },
      });

      if (existing) {
        throw new ConflictException('You already have an active reservation for this concert');
      }

      if (concert.reservedSeats >= concert.totalSeats) {
        throw new ConflictException('Concert is fully booked');
      }

      concert.reservedSeats += 1;
      await manager.save(Concert, concert);

      const reservation = manager.create(Reservation, {
        userId,
        concertId: dto.concertId,
        status: ReservationStatus.ACTIVE,
      });

      return manager.save(Reservation, reservation);
    });
  }

  async cancel(userId: string, reservationId: string): Promise<Reservation> {
    return this.dataSource.transaction(async (manager) => {
      const reservation = await manager.findOne(Reservation, {
        where: { id: reservationId, userId },
      });

      if (!reservation) throw new NotFoundException('Reservation not found');
      if (reservation.status === ReservationStatus.CANCELLED) {
        throw new ConflictException('Reservation is already cancelled');
      }

      const concert = await manager.findOne(Concert, {
        where: { id: reservation.concertId },
        lock: { mode: 'pessimistic_write' },
      });

      if (concert) {
        concert.reservedSeats = Math.max(0, concert.reservedSeats - 1);
        await manager.save(Concert, concert);
      }

      reservation.status = ReservationStatus.CANCELLED;
      return manager.save(Reservation, reservation);
    });
  }

  findMyReservations(userId: string): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      where: { userId },
      relations: ['concert'],
      order: { createdAt: 'DESC' },
    });
  }

  findAll(): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      relations: ['concert', 'user'],
      order: { createdAt: 'DESC' },
    });
  }
}
