import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { ExpenseCategoryService } from 'src/api/expenseCategories/expenseCategory.service';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { TripGuard } from '../trips/trip.guard';
import { TokenService } from 'src/utils/token';
import { AuthModule } from 'src/api/auth/auth.module';
import { TripModule } from '../trips/trip.module';

const PROVIDERS = [AuthGuard, TripGuard, TokenService, DatabaseService, ExpenseService, ExpenseCategoryService];

@Module({
  imports: [AuthModule, TripModule],
  controllers: [ExpenseController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class ExpenseModule {}
