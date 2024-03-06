import { join } from 'path';

export default class SysHelper {
  static pathConfig = (path: string): any => {
    return join(__dirname, '..', '..', path, '/**/*.entity{.ts,.js}');
  };
}
