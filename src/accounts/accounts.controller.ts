import { User } from '.prisma/client';
import { Body, Controller, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { LoginDto } from './dtos/Login-dto';
import { SignUpDto } from './dtos/SignUp-dto';

@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post('signup')
  async createUser(@Body() signUpDto: SignUpDto): Promise<User | Object> {
    return this.accountsService.createUser(signUpDto);
  }

  @Post('login')
  async validateUser(@Body() loginDto: LoginDto): Promise<{ access: string }> {
    return this.accountsService.validateUser(loginDto);
  }
}
