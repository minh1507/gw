import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../account/entities/account.entity';
import { JwtModule } from '@nestjs/jwt';
import { Role } from '../role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Role]), JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
