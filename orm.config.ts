import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: ['dist/**/**/entities/*.entity{.ts,.js}'],
  logging: true,
  synchronize: false,
  migrationsRun: false,
  migrations: ['dist/**/migrations/*.js'],
});

export default AppDataSource;
