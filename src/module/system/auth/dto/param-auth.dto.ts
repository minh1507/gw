import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ContentEnum } from 'src/common/enum/content.enum';
import { FieldEnum } from 'src/common/enum/field.enum';
import ResponseHelper from 'src/common/util/response.util';

export class LoginPayloadDto {
  @ApiProperty({
    description: 'Tên tài khoản người dùng',
    default: 'admin',
  })
  @IsNotEmpty({
    message: ResponseHelper.response(ContentEnum.REQUIRED, FieldEnum.USERNAME),
  })
  username: string;

  @ApiProperty({
    description: 'Mật khẩu người dùng',
    default: '12345678',
  })
  @IsNotEmpty({
    message: ResponseHelper.response(ContentEnum.REQUIRED, FieldEnum.PASSWORD),
  })
  password: string;
}

export class RefreshTokenPayloadDto {
  @ApiProperty({
    description: 'Refresh token',
    default: '******',
  })
  @IsNotEmpty({
    message: ResponseHelper.response(
      ContentEnum.REQUIRED,
      FieldEnum.REFRESH_TOKEN,
    ),
  })
  refreshToken: string;
}
