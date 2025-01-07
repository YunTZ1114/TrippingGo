import { Controller, Get } from '@nestjs/common';
import { ExpenseCategoryService } from './expenseCategory.service';

@Controller('expenseCategories')
export class ExpenseCategoryController {
  constructor(private readonly expenseCategoryService: ExpenseCategoryService) {}

  @Get()
  async getAllExpenseCategories() {
    const result = await this.expenseCategoryService.getAllExpenseCategories();
    return { data: result };
  }
}
