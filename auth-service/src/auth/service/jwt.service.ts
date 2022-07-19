import { Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '../entity/auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export interface JwtPayload {
  id: number;
  email: string;
}

@Injectable()
export class JwtService {
  @InjectRepository(Auth)
  private readonly repository: Repository<Auth>;

  private readonly jwtService: Jwt;

  constructor(jwtService: Jwt) {
    this.jwtService = jwtService;
  }

  public generateToken(auth: Auth): string {
    const payload: JwtPayload = {
      id: auth.id,
      email: auth.email
    };

    return this.jwtService.sign(payload);
  }

  public async verify(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token);
    } catch (err) {}
  }

  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  public comparePasswords(password: string, encodedPassword: string): boolean {
    return bcrypt.compareSync(password, encodedPassword);
  }
}
