import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '../entity/auth.entity';
import { Repository } from 'typeorm';
import { JwtPayload, JwtService } from './jwt.service';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ValidateRequest,
  ValidateResponse
} from '../auth.pb';
import { ResponseStatus } from '../message/response-status';

@Injectable()
export class AuthService {

  @InjectRepository(Auth)
  private readonly repository: Repository<Auth>;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  public async register({ email, password }: RegisterRequest): Promise<RegisterResponse> {
    let auth: Auth = await this.repository.findOneBy({ email });

    if (auth) {
      return {
        ...ResponseStatus.ALREADY_EXISTS
      };
    }

    auth = new Auth();

    auth.email = email;
    auth.password = this.jwtService.encodePassword(password);

    await this.repository.save(auth);

    return {
      ...ResponseStatus.CREATED
    };
  }

  public async login({ email, password }: LoginRequest): Promise<LoginResponse> {
    const auth: Auth = await this.repository.findOneBy({ email });

    if (!auth) {
      return {
        ...ResponseStatus.NOT_FOUND,
        token: null
      };
    }

    const isPasswordValid: boolean = this.jwtService.comparePasswords(password, auth.password);

    if (!isPasswordValid) {
      return {
        ...ResponseStatus.PASSWORD_INCORRECT,
        token: null
      };
    }

    const token: string = this.jwtService.generateToken(auth);

    return {
      ...ResponseStatus.SUCCESS,
      token
    };
  }

  public async validate({ token }: ValidateRequest): Promise<ValidateResponse> {
    const decoded: JwtPayload = await this.jwtService.verify(token);

    if (!decoded) {
      return {
        ...ResponseStatus.TOKEN_INVALID,
        userId: null
      };
    }

    const auth: Auth = await this.repository.findOneBy({ id: decoded.id });

    if (!auth) {
      return {
        ...ResponseStatus.NOT_FOUND,
        userId: null
      };
    }

    return {
      ...ResponseStatus.SUCCESS,
      userId: decoded.id
    }
  }
}
