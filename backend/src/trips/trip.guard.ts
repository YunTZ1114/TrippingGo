import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { TripMemberService } from '../tripMember/tripMember.service';

@Injectable()
export class TripGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tripMemberService: TripMemberService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<number>('requiredPermission', context.getHandler());
    const request: Request = context.switchToHttp().getRequest();
    const { url, userId } = request;

    const urlArr = url.split('/');
    const tripId = Number(urlArr[3]);

    try {
      if (!requiredPermission) return true;
      const { permissions, id } = await this.tripMemberService.getTripMemberPermission(tripId, userId);

      request.userPermission = permissions;
      request.tripMemberId = id;

      return permissions >= requiredPermission;
    } catch (error) {
      throw new UnauthorizedException('Invalid permissionCode : ', error.message);
    }
  }
}
