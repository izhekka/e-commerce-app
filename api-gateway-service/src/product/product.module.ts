import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_PACKAGE_NAME, PRODUCT_SERVICE_NAME } from './product.pb';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50053',
          package: PRODUCT_PACKAGE_NAME,
          protoPath: 'node_modules/proto/proto-files/product.proto'
        }
      }
    ])
  ],
  controllers: [ProductController]
})
export class ProductModule {}
