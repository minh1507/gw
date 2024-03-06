import { Role } from '../../module/system/role/entities/role.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class RoleSeeder implements Seeder {
  public roleData = {
    ADMIN: {
      id: 1,
      code: 'ADMIN',
      name: 'Quản trị viên',
      isFixed: true,
    },
    USER: {
      id: 2,
      code: 'USER',
      name: 'Người dùng',
      isFixed: true,
    },
  };
  public async run(dataSource: DataSource): Promise<any> {
    const roleRepository = dataSource.getRepository(Role);
    await roleRepository.save([this.roleData.ADMIN, this.roleData.USER]);
  }
}
