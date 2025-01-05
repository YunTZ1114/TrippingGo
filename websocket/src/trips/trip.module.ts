import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TripMemberGateway } from './gateways/tripMember.gateway';
import { PlaceGateway } from './gateways/places.gateway';
import { CheckListsGateway } from './gateways/checkLists.gateway';

@Module({
  imports: [HttpModule],
  providers: [TripMemberGateway, PlaceGateway, CheckListsGateway],
  controllers: [],
})
export class TripsModule {}
