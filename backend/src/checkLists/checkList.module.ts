import { AuthGuard } from 'src/auth/auth.guard';
import { DatabaseService } from 'src/database/database.service';
import { TokenService } from 'src/utils/token';
import { CheckListService } from './checkList.service';
import { DynamicModule, Module } from '@nestjs/common';
import { CheckListController } from './checkList.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TripGuard } from 'src/trips/trip.guard';
import { TripModule } from 'src/trips/trip.module';

const PROVIDERS = [AuthGuard, TripGuard, TokenService, DatabaseService, CheckListService];

@Module({
  imports: [AuthModule, TripModule],
  controllers: [CheckListController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class CheckListModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: CheckListModule,
    };
  }
}
