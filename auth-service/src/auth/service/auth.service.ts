import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '../entity/auth.entity';
import { Repository } from 'typeorm';
import { JwtPayload, JwtService } from './jwt.service';
import { LoginRequestDto, RegisterRequestDto, ValidateRequestDto } from '../auth.dto';
import { LoginResponse, RegisterResponse, ValidateResponse } from '../auth.pb';

@Injectable()
export class AuthService {
  @InjectRepository(Auth)
  private readonly repository: Repository<Auth>;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  public async register({ email, password }: RegisterRequestDto): Promise<RegisterResponse> {
    let auth: Auth = await this.repository.findOneBy({ email });

    if (auth) {
      return {
        status: HttpStatus.CONFLICT,
        error: ['e-mail already exists']
      };
    }

    auth = new Auth();

    auth.email = email;
    auth.password = this.jwtService.encodePassword(password);

    await this.repository.save(auth);

    return {
      status: HttpStatus.CREATED,
      error: null
    };
  }

  public async login({ email, password }: LoginRequestDto): Promise<LoginResponse> {
    const auth: Auth = await this.repository.findOneBy({ email });

    if (!auth) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['e-mail not found'],
        token: null
      };
    }

    const isPasswordValid: boolean = this.jwtService.comparePasswords(password, auth.password);

    if (!isPasswordValid) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['Password is incorrect'],
        token: null
      };
    }

    const token: string = this.jwtService.generateToken(auth);

    return {
      status: HttpStatus.OK,
      error: null,
      token
    };
  }

  public async validate({ token }: ValidateRequestDto): Promise<ValidateResponse> {
    const decoded: JwtPayload = await this.jwtService.verify(token);

    if (!decoded) {
      return {
        status: HttpStatus.FORBIDDEN,
        error: ['Token is invalid'],
        userId: null
      };
    }

    const auth: Auth = await this.repository.findOneBy({ id: decoded.id });

    if (!auth) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['User not found'],
        userId: null
      };
    }

    return {
      status: HttpStatus.OK,
      error: null,
      userId: decoded.id
    }
  }
}
