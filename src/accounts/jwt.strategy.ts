import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from 'src/prisma.sevice';
import { User } from '.prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topSecret51',
    });
  }

  async validate(payload: { user_email: string }): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.user_email,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
