import { IsArray, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class ExpenseShareDto {
  @IsNumber()
  tripMemberId: number;

  @IsNumber()
  amount: number;

  @IsOptional()
  isDelete?: boolean;
}

export class ExpenseDto {
  @IsNumber()
  categoryId: number;

  @IsNumber()
  currencyId: number;

  @IsOptional()
  @IsNumber()
  placeId?: number;

  @IsDateString()
  time: Date;

  @IsString()
  name: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  imageUrl: string[];

  @IsOptional()
  @IsArray()
  expenseShares?: ExpenseShareDto[];
}
