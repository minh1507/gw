import { Module } from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { PasswordModule } from './password/password.module';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [],
  providers: [],
  imports: [RoleModule, PasswordModule, AuthModule],
})
export class SystemModule {}
