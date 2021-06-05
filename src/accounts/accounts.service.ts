import { User } from '.prisma/client';
import { Prisma } from '.prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.sevice';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/Login-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(userData: Prisma.UserCreateInput): Promise<Object> {
    const { password } = userData;
    userData.salt = await bcrypt.genSalt();
    const hash_password = await this.hashing_password(password, userData.salt);
    userData.password = hash_password;
    try {
      const user = await this.prisma.user.create({
        data: userData,
      });
      return { success: 'user have been created!' };
    } catch (error) {
      console.log(error);
      const errormsg =
        error.code === 'P2002'
          ? 'this email already been used.'
          : 'there was an error during creating account. please try again or ask for help in contacting us section.';

      return { error: errormsg };
    }
  }

  async validateUser(userData: LoginDto): Promise<{ access: string }> {
    const { email, password } = userData;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    const check_password = await this.hashing_password(password, user.salt);
    if (check_password === user.password) {
      const payload = { user_email: user.email };
      const access = await this.jwtService.sign(payload);
      return { access };
    } else {
      throw new UnauthorizedException('invalid cridentials!');
    }
  }

  private async hashing_password(
    password: string,
    salt: string,
  ): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
