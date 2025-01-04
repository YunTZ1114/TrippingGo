import { Module } from '@nestjs/common';
import { TripsModule } from './trips/trip.module';

@Module({
  imports: [TripsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
