import { CacheModule } from '@nestjs/cache-manager';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { dataSourceOptions } from './config/data-source.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { TypeOrmExceptionFilter } from './common/filter/typeorm-exception.filter';
import { InitModule } from './module/init.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => dataSourceOptions,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        store: redisStore,
      }),
    }),
    ScheduleModule.forRoot(),
    JwtModule,
    InitModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: TypeOrmExceptionFilter,
    },
  ],
})
export class AppModule {}
