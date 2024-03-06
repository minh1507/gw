import { Module } from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { PasswordModule } from './password/password.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';

@Module({
  controllers: [],
  providers: [],
  imports: [RoleModule, PasswordModule, AuthModule, AccountModule],
})
export class SystemModule {}
