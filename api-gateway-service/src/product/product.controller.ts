import { Body, Controller, Get, Inject, OnModuleInit, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import {
  CreateProductRequest,
  CreateProductResponse,
  FindOneResponse,
  PRODUCT_SERVICE_NAME,
  ProductServiceClient
} from './product.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthGuard } from '../auth/auth.guard';
import { Observable } from 'rxjs';

@Controller('product')
export class ProductController implements OnModuleInit {
  private productServiceClient: ProductServiceClient;

  @Inject(PRODUCT_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.productServiceClient = this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  @Post()
  @UseGuards(AuthGuard)
  private async createProduct(@Body() body: CreateProductRequest): Promise<Observable<CreateProductResponse>> {
    return this.productServiceClient.createProduct(body);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  private async findOne(@Param('id', ParseIntPipe) id: number): Promise<Observable<FindOneResponse>> {
    return this.productServiceClient.findOne({ id });
  }
}
