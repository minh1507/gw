import * as bcrypt from 'bcrypt';
import { Account } from '../../module/system/account/entities/account.entity';
import { Password } from '../../module/system/password/entities/password.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class AccountSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const accountRepository = dataSource.getRepository(Account);
    const PasswordRepository = dataSource.getRepository(Password);
    await accountRepository.save([
      {
        id: 1,
        username: 'admin',
        fullname: 'administrator',
        phoneNumber: '123456789',
        role: {
          id: 1,
        },
      },
    ]);
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash('12345678', salt);
    await PasswordRepository.save({
      id: 1,
      account: {
        id: 1,
      },
      hash: hash,
    });
  }
}
