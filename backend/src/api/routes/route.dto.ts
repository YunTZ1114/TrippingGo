import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNumber, Min, ValidateNested } from 'class-validator';

export enum TravelMode {
  BICYCLING = 'BICYCLING',
  DRIVING = 'DRIVING',
  TRANSIT = 'TRANSIT',
  WALKING = 'WALKING',
}

export class PathPointDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class UpdatedRouteDto {
  @IsEnum(TravelMode)
  travelMode: TravelMode;

  @IsInt()
  @Min(0)
  duration: number;

  @IsInt()
  @Min(0)
  distance: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PathPointDto)
  path: PathPointDto[];
}

export class BaseRouteDto extends UpdatedRouteDto {
  @IsInt()
  @Min(1)
  startingPointId: number;

  @IsInt()
  @Min(1)
  destinationId: number;
}
