import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AUTH_SERVICE_NAME, AuthServiceClient, ValidateResponse } from './auth.pb';

@Injectable()
export class AuthService implements OnModuleInit {
  private authServiceClient: AuthServiceClient;

  @Inject(AUTH_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.authServiceClient = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  public async validate(token: string): Promise<ValidateResponse> {
    return firstValueFrom(this.authServiceClient.validate({token}));
  }
}
