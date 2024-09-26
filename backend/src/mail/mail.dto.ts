import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MailDto {
  @IsOptional()
  userId: number;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  html: string;

  @IsOptional()
  isUsed?: boolean;

  @IsOptional()
  expiresAt?: Date;
}
