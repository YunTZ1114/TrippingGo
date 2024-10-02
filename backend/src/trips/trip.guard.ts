import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { TripService } from './trip.service';

@Injectable()
export class TripGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tripService: TripService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<number>('requiredPermission', context.getHandler());
    const request: Request = context.switchToHttp().getRequest();
    const { url, userId } = request;
    const urlArr = url.split('/');

    try {
      if (!requiredPermission) return true;
      const userPermission = await this.tripService.getTripMemberPermission(Number(urlArr[3]), userId);

      return userPermission >= requiredPermission;
    } catch (error) {
      throw new UnauthorizedException('Invalid permissionCode : ', error.message);
    }
  }
}
