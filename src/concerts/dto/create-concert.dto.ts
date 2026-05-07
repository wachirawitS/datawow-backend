import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateConcertDto {
  @ApiProperty({ example: 'Rock Night 2026' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({ example: 'An amazing free rock concert' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(1)
  totalSeats: number;
}
