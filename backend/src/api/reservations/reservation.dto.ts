import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class ReservationDto {
  @IsNumber()
  tripMemberId: number;

  @IsString()
  type: string;

  @IsString()
  title: string;

  @IsDateString()
  reservationTime: Date;

  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  placeId: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
