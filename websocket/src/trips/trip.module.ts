import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TripMemberGateway } from './gateways/trip-member.gateway';
import { PlaceGateway } from './gateways/places.gateway';

@Module({
  imports: [HttpModule],
  providers: [TripMemberGateway, PlaceGateway],
  controllers: [],
})
export class TripsModule {}
