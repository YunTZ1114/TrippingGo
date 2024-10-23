import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { PlaceType } from 'src/types/place.type';

export class PlaceDto {
  @IsOptional()
  @IsNumber()
  tripId: number;

  @IsNumber()
  locationLat: number;

  @IsNumber()
  locationLng: number;

  @IsString()
  name: string;

  @IsArray()
  weekdayText: string[];

  @IsOptional()
  @IsString()
  googleMapUrl?: string;

  @IsOptional()
  @IsString()
  googlePlaceId?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class PlaceAttributesDto {
  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsString()
  type?: PlaceType;
}
