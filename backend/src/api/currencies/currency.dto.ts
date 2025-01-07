import { IsString, IsDecimal, IsBoolean } from 'class-validator';

export class CurrencyDto {
  @IsString()
  code: string;

  @IsDecimal({ decimal_digits: '0,6' })
  exchangeRate: number;

  @IsBoolean()
  baseCurrency: boolean;
}
