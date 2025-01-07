import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { TokenService } from 'src/utils/token';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const decoded: JwtPayload = await this.tokenService.verifyJwtToken(token);
      const userId = decoded.userId;

      const user = await this.authService.getUserById(userId);
      if (user?.id !== userId) throw new UnauthorizedException('User not found');

      request.userId = userId;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token : ', error.message);
    }
  }
}

