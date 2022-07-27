import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { StockDecreaseLog } from './entity/stock-decrease-log.entity';
import { CreateProductRequestDto, DecreaseStockRequestDto, FindOneRequestDto } from './product.dto';
import { Builder } from 'builder-pattern';

export enum DecreaseStatus {
  OK = 1,
  NOT_ENOUGH = 2,
  CONFLICT = 3,
  NOT_FOUND = 4
}

@Injectable()
export class ProductService {

  @InjectRepository(Product)
  private readonly productRepository: Repository<Product>;

  @InjectRepository(StockDecreaseLog)
  private readonly logRepository: Repository<StockDecreaseLog>;

  public async create(payload: CreateProductRequestDto): Promise<Product> {
    const product: Product = Builder(Product)
      .name(payload.name)
      .sku(payload.sku)
      .stock(payload.stock)
      .price(payload.price)
      .build();

    return await this.productRepository.save(product);
  }

  public async findOne({ id }: FindOneRequestDto): Promise<Product> {
    return await this.productRepository.findOneBy({ id });
  }

  public async decreaseStock({ productId, orderId }: DecreaseStockRequestDto): Promise<DecreaseStatus> {
    const product: Product = await this.productRepository.findOne({ select: ['id', 'stock'], where: { id: productId }});

    if (!product) {
      return DecreaseStatus.NOT_FOUND;
    } else if (product.stock <= 0) {
      return DecreaseStatus.NOT_ENOUGH;
    }

    const orderCount: number = await this.logRepository.countBy({ orderId });
    if (orderCount) {
      return DecreaseStatus.CONFLICT;
    }

    await this.productRepository.update(product.id, { stock: product.stock - 1 });
    await this.logRepository.insert( { product, orderId });

    return DecreaseStatus.OK;
  }
}
