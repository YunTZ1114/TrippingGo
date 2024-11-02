import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsNumber, IsOptional, IsString, Max, Min, Validate } from 'class-validator';

class IsValidColRange {
  validate(col: number[]) {
    if (!Array.isArray(col) || col.length !== 2) return false;
    return col[0] <= col[1];
  }

  defaultMessage() {
    return 'First number must be less than or equal to second number in col array';
  }
}

export class PlaceDurationDto {
  @IsNumber()
  placeId: number;

  @IsString()
  date: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(144, { each: true })
  @Validate(IsValidColRange)
  col: number[];

  @IsInt()
  @Min(0)
  row: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  groupNumber?: number | null;
}
