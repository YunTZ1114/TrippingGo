import { IsNotEmpty, IsString, IsOptional, IsObject, IsInt, IsEnum } from 'class-validator';
import { AssignablePermissions } from 'src/types/tripMember.type';

export class UpdateTripMemberDto {
  @IsOptional()
  info: TripMemberInfoDto[];

  @IsOptional()
  permissions: TripMemberPermissionDto[];
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
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsEnum(AssignablePermissions, {
    message: 'Permissions must be either VIEWER or EDITOR',
  })
  permissions: AssignablePermissions;
}
