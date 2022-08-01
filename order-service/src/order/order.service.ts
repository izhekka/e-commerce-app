import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DecreaseStockResponse, FindOneResponse, PRODUCT_SERVICE_NAME, ProductServiceClient } from './proto/product.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderRequest, CreateOrderResponse } from './proto/order.pb';
import { firstValueFrom } from 'rxjs';
import { Builder } from 'builder-pattern';

@Injectable()
export class OrderService implements OnModuleInit {

  private productServiceClient: ProductServiceClient;

  @Inject(PRODUCT_SERVICE_NAME)
  private readonly client: ClientGrpc;

  @InjectRepository(Order)
  private readonly repository: Repository<Order>;

  onModuleInit(): void {
    this.productServiceClient = this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  public async createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
    const product: FindOneResponse = await firstValueFrom(this.productServiceClient.findOne({ id: data.productId }));

    if (product.status >= HttpStatus.NOT_FOUND) {
      return { id: null, error: product.error, status: product.status };
    } else if (product.data.stock < data.quantity) {
      return { id: null, error: ['Product quantity is not enough'], status: HttpStatus.CONFLICT };
    }

    const order: Order = Builder(Order)
      .price(product.data.price)
      .productId(product.data.id)
      .userId(data.userId)
      .build();

    await this.repository.save(order);

    const decreaseStockResponse: DecreaseStockResponse =
      await firstValueFrom(this.productServiceClient.decreaseStock({ productId: data.productId, orderId: order.id }));

    if (decreaseStockResponse.status === HttpStatus.CONFLICT) {
      await this.repository.delete({ id: order.id });

      return { id: null, error: decreaseStockResponse.error, status: decreaseStockResponse.status };
    }

    return { id: order.id, error: null, status: HttpStatus.OK };
  }
}
