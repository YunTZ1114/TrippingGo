import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TripMemberGateway } from './gateways/trip-member.gateway';

@Module({
  imports: [HttpModule],
  providers: [TripMemberGateway],
  controllers: [],
})
export class TripsModule {}
