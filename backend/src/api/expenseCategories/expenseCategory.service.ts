import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ExpenseCategoryService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllExpenseCategories() {
    const expenseCategories = await this.databaseService.expenseCategory.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return expenseCategories;
  }
}
