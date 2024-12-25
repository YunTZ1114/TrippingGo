import { CommonFields } from './common.type';

export interface ExpenseShare {
  tripMemberId: number;
  amount: number;
  isDelete?: boolean;
}

export interface BaseExpense {
  categoryId: number;
  currencyId: number;
  placeId?: number;
  time: Date;
  name: string;
  amount: number;
  description?: string;
  imageUrl?: string[];
  expenseShares?: ExpenseShare[];
}

export interface Expense extends BaseExpense, CommonFields {
  id: number;
  tripId: number;
  tripMemberId: number;
}
