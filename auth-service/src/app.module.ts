import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config, { DatabaseConfig } from '../config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig: DatabaseConfig = configService.get<DatabaseConfig>('database');
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          database: dbConfig.name,
          username: dbConfig.username,
          password: dbConfig.password,
          entities: ['dist/**/*.entity.{ts,js}'],
          synchronize: false
        }
      }
    }),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
