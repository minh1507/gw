import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TagEnum } from '../../../common/enum/tag.enum';
import { AuthService } from './auth.service';
import { LoginPayloadDto, RefreshTokenPayloadDto } from './dto/param-auth.dto';
import { Account } from '../account/entities/account.entity';
import { AccountDecorator } from 'src/common/decorator/account.decorator';

@Controller('auth/')
@ApiTags(TagEnum.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: LoginPayloadDto) {
    const result = await this.authService.login(payload);
    return result;
  }

  @Get('logout')
  @ApiBearerAuth('Token')
  async logout(@AccountDecorator() account: Account) {
    const result = await this.authService.logout(account.accessTokenKey);
    return result;
  }

  @Post('refresh-token')
  async refresh(@Body() payload: RefreshTokenPayloadDto) {
    const result = await this.authService.refresh(payload);
    return result;
  }
}
