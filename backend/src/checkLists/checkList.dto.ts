import { IsNotEmpty, IsString, IsOptional, IsObject, IsArray } from 'class-validator';
import { CheckListType } from 'src/types/checkList.type';

export class CheckListDescriptionDto {
  @IsOptional()
  @IsObject({ message: 'Description must be an object' })
  description?: Record<string, any>;
}

export class CheckListDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  type: CheckListType;

  @IsNotEmpty()
  @IsArray()
  description: string[];

  @IsNotEmpty()
  isPublic: boolean;
}
