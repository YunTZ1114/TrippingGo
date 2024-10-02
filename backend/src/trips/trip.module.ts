import { Module, DynamicModule } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TokenService } from 'src/utils/token';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { TripGuard } from './trip.guard';

const PROVIDERS = [AuthGuard, TripGuard, TokenService, DatabaseService, TripService];

@Module({
  imports: [AuthModule],
  controllers: [TripController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class TripModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: TripModule,
    };
  }
}
