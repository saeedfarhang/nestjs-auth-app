import { IsEmail, IsNotEmpty, Max, max, Min } from 'class-validator';

export class SignUpDto {
  name: string;

  @IsEmail()
  email: string;

  @Min(6)
  password: string;

  salt: string;
}
