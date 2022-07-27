import { CreateProductRequest, DecreaseStockRequest, FindOneRequest } from './product.pb';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FindOneRequestDto implements FindOneRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly id: number;
}

export class CreateProductRequestDto implements CreateProductRequest {
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @IsString()
  @IsNotEmpty()
  public readonly sku: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly stock: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly price: number;
}

export class DecreaseStockRequestDto implements DecreaseStockRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly productId: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly orderId: number;
}
