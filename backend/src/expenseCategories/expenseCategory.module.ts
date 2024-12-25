import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ExpenseCategoryController } from './expenseCategory.controller';
import { ExpenseCategoryService } from './expenseCategory.service';

@Module({
  imports: [],
  controllers: [ExpenseCategoryController],
  providers: [ExpenseCategoryService, DatabaseService],
})
export class ExpenseCategoryModule {}
