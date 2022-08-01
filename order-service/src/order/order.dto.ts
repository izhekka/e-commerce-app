import { CreateOrderRequest } from './proto/order.pb';
import { IsNumber, Min } from 'class-validator';

export class CreateOrderRequestDto implements CreateOrderRequest {

  @IsNumber()
  public productId: number;

  @IsNumber()
  @Min(1)
  public quantity: number;

  @IsNumber()
  public userId: number;
}