import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'micro_product',
      username: 'postgres',
      password: 'postgres',
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: false
    }),
    ProductModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
