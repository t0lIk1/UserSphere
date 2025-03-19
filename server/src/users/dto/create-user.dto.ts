import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(1)
  readonly password: string;
}
