import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { PrismaService } from 'src/prisma.sevice';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: { expiresIn: 3600 },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AccountsService, PrismaService],
  controllers: [AccountsController],
})
export class AccountsModule {}
