import { Request, Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { TripGuard } from '../trips/trip.guard';
import { ExpenseService } from './expense.service';
import { RequiredPermission } from 'src/decorators/required-permission.decorator';
import { PermissionsText } from 'src/types/tripMember.type';
import { ExpenseDto } from './expense.dto';

@Controller('trips/:tripId/expenses')
@UseGuards(AuthGuard, TripGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get('')
  @RequiredPermission(PermissionsText.VIEWER)
  async getExpenses(@Param('tripId') tripId: number) {
    const expenses = await this.expenseService.getExpenses(tripId);
    return { data: expenses };
  }

  @Get('/expense-shares')
  @RequiredPermission(PermissionsText.VIEWER)
  async getExpenseShares(@Param('tripId') tripId: number) {
    const expenseShares = await this.expenseService.getExpenseShares(tripId);
    return { data: expenseShares };
  }

  @Post('')
  @RequiredPermission(PermissionsText.EDITOR)
  async createExpense(@Request() req, @Param('tripId') tripId: number, @Body() expense: ExpenseDto) {
    const { tripMemberId } = req;
    console.log(expense);
    const expenseId = await this.expenseService.createExpense({ tripId, tripMemberId, ...expense });

    return { data: expenseId };
  }

  @Put('/:expenseId')
  @RequiredPermission(PermissionsText.EDITOR)
  async updateExpense(@Param('tripId') tripId: number, @Param('expenseId') expenseId: number, @Body() expenseDto: ExpenseDto) {
    await this.expenseService.updateExpense({ id: expenseId, tripId, ...expenseDto });

    return { message: 'Update expense in trip successfully' };
  }

  @Delete('/:expenseId')
  @RequiredPermission(PermissionsText.EDITOR)
  async deleteExpense(@Param('tripId') tripId: number, @Param('expenseId') expenseId: number) {
    await this.expenseService.deleteExpense({ id: expenseId, tripId });

    return { message: 'Delete expense in trip successfully' };
  }
}
