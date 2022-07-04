import { Body, Controller, Inject, OnModuleInit, Post, Req, UseGuards } from '@nestjs/common';
import { CreateOrderRequest, CreateOrderResponse, ORDER_SERVICE_NAME, OrderServiceClient } from './order.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthenticatedRequest, AuthGuard } from '../auth/auth.guard';
import { Observable } from 'rxjs';

@Controller('order')
export class OrderController implements OnModuleInit {
  private orderServiceClient: OrderServiceClient;

  @Inject(ORDER_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.orderServiceClient = this.client.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }

  @Post()
  @UseGuards(AuthGuard)
  private async createOrder(@Req() req: AuthenticatedRequest, @Body() body: CreateOrderRequest): Promise<Observable<CreateOrderResponse>> {
    body.userId = req.userId;

    return this.orderServiceClient.createOrder(body);
  }
}
