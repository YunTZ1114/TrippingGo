import { IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { TripFilterType } from 'src/types/trip.type';

export class TripDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNumber()
  currencyId: number;

  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @IsNotEmpty()
  @IsDateString()
  endTime: Date;

  @IsArray()
  @IsInt({ each: true })
  memberIds: number[];
}

export class TripQueryDto {
  @IsEnum(TripFilterType)
  filter: TripFilterType;

  @IsOptional()
  @IsString()
  q?: string;
}

export class UpdateTripDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNumber()
  currencyId: number;

  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @IsNotEmpty()
  @IsDateString()
  endTime: Date;

  @IsOptional()
  @IsString()
  coverUrl?: string;
}
