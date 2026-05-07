import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Concert } from '../concerts/entities/concert.entity';
import { Reservation } from '../reservations/entities/reservation.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'app',
  entities:
    process.env.NODE_ENV === 'production'
      ? ['dist/**/*.entity.js']
      : [User, Concert, Reservation],
  migrations:
    process.env.NODE_ENV === 'production'
      ? ['dist/database/migrations/*.js']
      : ['src/database/migrations/*.ts'],
  synchronize: false,
});