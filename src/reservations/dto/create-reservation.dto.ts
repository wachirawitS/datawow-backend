import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: 'uuid-of-concert' })
  @IsUUID()
  concertId: string;
}
