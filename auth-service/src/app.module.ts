import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'micro_auth',
      username: 'postgres',
      password: 'postgres',
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: false
    }),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
