import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concert } from './entities/concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert)
    private readonly concertsRepository: Repository<Concert>,
  ) {}

  create(dto: CreateConcertDto): Promise<Concert> {
    const concert = this.concertsRepository.create(dto);
    return this.concertsRepository.save(concert);
  }

  findAll(): Promise<Concert[]> {
    return this.concertsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Concert> {
    const concert = await this.concertsRepository.findOneBy({ id });
    if (!concert) throw new NotFoundException('Concert not found');
    return concert;
  }

  async remove(id: string): Promise<void> {
    const concert = await this.findOne(id);
    await this.concertsRepository.remove(concert);
  }
}
