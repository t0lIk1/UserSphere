import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(1)
  readonly password: string;
}
