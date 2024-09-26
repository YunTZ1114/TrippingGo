import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { TokenService } from 'src/utils/token';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const decoded: JwtPayload = await this.tokenService.verifyJwtToken(token);
      request.userId = decoded.userId;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token : ', error.message);
    }
  }
}
