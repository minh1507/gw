import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Password } from './entities/password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Password])],
  controllers: [PasswordController],
  providers: [PasswordService],
})
export class PasswordModule {}
