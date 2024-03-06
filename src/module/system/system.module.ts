import { Module } from '@nestjs/common';
import { RoleModule } from './role/role.module';

@Module({
  controllers: [],
  providers: [],
  imports: [RoleModule],
})
export class SystemModule {}
