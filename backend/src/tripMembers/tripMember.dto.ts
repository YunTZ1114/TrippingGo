import { IsNotEmpty, Min, Max, IsString, IsOptional, IsInt, IsObject } from 'class-validator';

export class UpdateTripMemberDto {
  @IsOptional()
  info: TripMemberInfoDto[];

  @IsOptional()
  permissions: TripMemberPermissionDto[];
}

export class DeleteTripMemberDto {
  @IsOptional()
  deletedIds: number[];
}

export class TripMemberInfoDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  nickname: string;

  @IsOptional()
  @IsObject({ message: 'Description must be an object' })
  description?: Record<string, any>;

  @IsOptional()
  @IsString()
  note?: string;
}

export class TripMemberPermissionDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0, { message: 'Permissions must be at least 0' })
  @Max(4, { message: 'Permissions cannot be greater than 4' })
  permissions: number;
}
