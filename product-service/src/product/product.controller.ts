import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { DecreaseStatus, ProductService } from './product.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateProductResponse, DecreaseStockResponse, FindOneResponse, PRODUCT_SERVICE_NAME } from './product.pb';
import { CreateProductRequestDto, DecreaseStockRequestDto, FindOneRequestDto } from './product.dto';
import { Product } from './entity/product.entity';

@Controller()
export class ProductController {

  @Inject(ProductService)
  private readonly service: ProductService;

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'createProduct')
  private async create(payload: CreateProductRequestDto): Promise<CreateProductResponse> {
    const product: Product = await this.service.create(payload);

    return {
      id: product.id,
      error: null,
      status: HttpStatus.OK
    };
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'findOne')
  private async findOne(payload: FindOneRequestDto): Promise<FindOneResponse> {
    const product: Product = await this.service.findOne(payload);

    if (!product) {
      return {
        data: null,
        error: ['Product not found'],
        status: HttpStatus.NOT_FOUND
      }
    }

    return {
      data: product,
      error: null,
      status: HttpStatus.OK
    }
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'decreaseStock')
  private async decreaseStock(payload: DecreaseStockRequestDto): Promise<DecreaseStockResponse> {
    const status: DecreaseStatus = await this.service.decreaseStock(payload);

    const message = {
      [DecreaseStatus.NOT_FOUND]: ['Product not found'],
      [DecreaseStatus.NOT_ENOUGH]: ['Product quantity is not enough'],
      [DecreaseStatus.CONFLICT]: ['Order is already processed'],
      [DecreaseStatus.OK]: null
    };

    const httpStatus = {
      [DecreaseStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
      [DecreaseStatus.NOT_ENOUGH]: HttpStatus.BAD_REQUEST,
      [DecreaseStatus.CONFLICT]: HttpStatus.CONFLICT,
      [DecreaseStatus.OK]: HttpStatus.OK
    };

    return {
      error: message[status],
      status: httpStatus[status]
    };
  }
}
