import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDER_PACKAGE_NAME, ORDER_SERVICE_NAME } from './order.pb';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: ORDER_SERVICE_NAME,
                transport: Transport.GRPC,
                options: {
                    url: '0.0.0.0:50052',
                    package: ORDER_PACKAGE_NAME,
                    protoPath: 'node_modules/proto/proto-files/order.proto'
                }
            }
        ])
    ],
    controllers: [OrderController]
})
export class OrderModule {}
