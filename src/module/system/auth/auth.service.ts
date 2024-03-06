import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Account } from '../account/entities/account.entity';
import { LoginPayloadDto, RefreshTokenPayloadDto } from './dto/param-auth.dto';
import { ActionEnum } from 'src/common/enum/action.enum';
import { BaseService } from 'src/common/base/service.base';
import { FieldEnum } from 'src/common/enum/field.enum';
import { ContentEnum } from 'src/common/enum/content.enum';

@Injectable()
export class AuthService extends BaseService<Account> {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {
    super(accountRepository);
    this.name = AuthService.name;
    this.field = FieldEnum.AUTH;
  }

  async login(payload: LoginPayloadDto) {
    this.action = ActionEnum.LOGIN;

    const account = await this.accountRepository.findOne({
      where: { username: payload.username },
      relations: {
        password: true,
        role: true,
      },
    });
    if (!account) this.reponseCustom(ContentEnum.NOT_FOUND, FieldEnum.USERNAME);
    const isCheckPassword = await bcrypt.compare(
      payload.password,
      account.password.hash,
    );
    if (!isCheckPassword)
      this.reponseCustom(ContentEnum.INVALID, FieldEnum.PASSWORD);

    // gen access token and refresh token key
    const accessTokenKey = `${account.username}${uuid()}`;
    const refreshTokenKey = `${account.username}${uuid()}`;

    console.log(account)
    // create token
    const payloadToSign = {
      id: account.id,
      username: account.username,
      fullname: account.fullname,
      role: {
        id: account.role.id,
      },
      accessTokenKey: accessTokenKey,
      refreshTokenKey: refreshTokenKey,
    };
    const accessToken = await this.jwtService.signAsync(payloadToSign, {
      secret: process.env.JWT_SECRET_KEY_FOR_ACCESS_TOKEN ?? 'gw',
      expiresIn:
        process.env.JWT_SECRET_KEY_FOR_ACCESS_TOKEN_EXPIRES_IN ?? 86400 + 's',
    });

    const refreshToken = await this.jwtService.signAsync(payloadToSign, {
      secret: process.env.JWT_SECRET_KEY_FOR_REFRESH_TOKEN ?? 'gw',
      expiresIn:
        process.env.JWT_SECRET_KEY_FOR_REFRESH_TOKEN_EXPIRES_IN ??
        8640000 + 's',
    });

    const valueCache = JSON.stringify({
      accountId: account.id,
      username: account.username,
      accessTokenKey: accessTokenKey,
      refreshTokenKey: refreshTokenKey,
    });

    await this.cacheService.set(`${accessTokenKey}`, valueCache, {
      ttl: Number(
        process.env.JWT_SECRET_KEY_FOR_ACCESS_TOKEN_EXPIRES_IN ?? 86400 + 's',
      ),
    });

    await this.cacheService.set(refreshTokenKey, valueCache, {
      ttl: Number(
        process.env.JWT_SECRET_KEY_FOR_REFRESH_TOKEN_EXPIRES_IN ??
          8640000 + 's',
      ),
    });

    return this.response({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  async logout(accessTokenKey: string) {
    this.action = ActionEnum.LOGOUT;

    const cacheData = JSON.parse(
      String(await this.cacheService.get(`${accessTokenKey}`)),
    );
    await this.cacheService.del(`${accessTokenKey}`);
    await this.cacheService.del(`${cacheData.refreshTokenKey}`);
    return this.response({});
  }

  async refresh(payload: RefreshTokenPayloadDto) {
    this.action = ActionEnum.REFRESH;

    const data = await this.jwtService.verifyAsync(payload.refreshToken, {
      secret: process.env.JWT_SECRET_KEY_FOR_REFRESH_TOKEN,
    });
    const cacheDataRefreshToken = JSON.parse(
      String(await this.cacheService.get(`${data.refreshTokenKey}`)),
    );
    if (!cacheDataRefreshToken)
      this.reponseCustomWithToast(ContentEnum.INVALID, FieldEnum.REFRESH_TOKEN);
    const account = await this.accountRepository.findOne({
      where: {
        id: cacheDataRefreshToken.accountId,
      },
      relations: {
        role: true,
      },
    });
    if (!account)
      this.reponseCustomWithToast(ContentEnum.INVALID, FieldEnum.REFRESH_TOKEN);
    const accessTokenKey = `${account.username}${uuid()}`;

    const payloadToSign = {
      id: account.id,
      username: account.username,
      role: {
        id: account.role.id,
      },
      fullname: account.fullname,
      accessTokenKey: accessTokenKey,
      refreshTokenKey: data.refreshTokenKey,
    };
    cacheDataRefreshToken.accessTokenKey = `${
      cacheDataRefreshToken.username
    }${uuid()}`;

    const accessToken = await this.jwtService.signAsync(payloadToSign, {
      secret: process.env.JWT_SECRET_KEY_FOR_ACCESS_TOKEN ?? 'bitecco',
      expiresIn:
        process.env.JWT_SECRET_KEY_FOR_ACCESS_TOKEN_EXPIRES_IN ?? 86400 + 's',
    });
    cacheDataRefreshToken.refreshTokenKey = data.refreshTokenKey;
    await this.cacheService.set(
      `${accessTokenKey}`,
      `${JSON.stringify(cacheDataRefreshToken)}`,
      {
        ttl: Number(process.env.JWT_SECRET_KEY_FOR_ACCESS_TOKEN_EXPIRES_IN),
      },
    );
    return this.response({ accessToken: accessToken });
  }
}
