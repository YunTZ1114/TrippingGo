import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TripMemberGateway } from './gateways/tripMember.gateway';
import { PlaceGateway } from './gateways/place.gateway';
import { CheckListsGateway } from './gateways/checkList.gateway';
import { PlaceDurationGateway } from './gateways/place-duration.gateway';

@Module({
  imports: [HttpModule],
  providers: [
    TripMemberGateway,
    PlaceGateway,
    CheckListsGateway,
    PlaceDurationGateway,
  ],
  controllers: [],
})
export class TripsModule {}
