import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'micro_order',
      username: 'postgres',
      password: 'postgres',
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: false
    }),
    OrderModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
