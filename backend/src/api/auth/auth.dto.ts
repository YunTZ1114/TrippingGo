import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { GenderType } from 'src/types/user.type';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  countryId: number;

  @IsNotEmpty()
  gender: GenderType;

  @IsOptional()
  avatar: string;

  @IsOptional()
  isVerified: boolean;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  stayLoggedIn: string;
}
