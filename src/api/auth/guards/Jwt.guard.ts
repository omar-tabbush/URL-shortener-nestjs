import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { PUBLIC_KEY } from 'src/common/constants/public.constant';

@Injectable()
export class JwtGuard extends AuthGuard('jwt')  {

  constructor(private jwtService: JwtService, private config: ConfigService, private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);

  }
}
