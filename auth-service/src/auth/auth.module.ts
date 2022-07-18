import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './auth.entity';
import { AuthService } from './service/auth.service';
import { JwtService } from './service/jwt.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'dev',
      signOptions: { expiresIn: '1d' }
    }),
    TypeOrmModule.forFeature([Auth])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService]
})
export class AuthModule {}
