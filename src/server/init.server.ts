import {
  BadRequestException,
  INestApplication,
  Logger,
  NestApplicationOptions,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import { AppModule } from '../app.module';
import { HttpExceptionFilter } from '../common/filter/http-exception.filter';

interface Init {
  port: string;
  prePort: number;
  enviroment: string;
  user: string;
  password: string;
  host: string;
}

class Main {
  private flag: number = 0;
  private logger: Logger = new Logger(this.constructor.name);
  private config: NestApplicationOptions = {
    cors: true,
    logger: ['error', 'warn', 'verbose', 'debug', 'fatal'],
  };
  private validationConfig: ValidationPipeOptions = {
    disableErrorMessages: false,
    whitelist: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    forbidNonWhitelisted: false,
    exceptionFactory: (errors) => {
      return new BadRequestException(
        errors.map((error) => {
          const errorType =
            error.constraints != null
              ? Object.keys(error.constraints)[
                  Object.keys(error.constraints).length - 1
                ]
              : 'failed';
          return `${error.property}.${errorType}`;
        }),
      );
    },
  };
  private configSwaggerB = {
    swaggerOptions: {
      displayOperationId: true,
      persistAuthorization: true,
    },
    customSiteTitle: process.env.SITE_TITLE,
    customCss: '.swagger-ui .topbar {display: none; }',
  };
  private configSwaggerA = new DocumentBuilder()
    .setTitle(process.env.TITLE)
    .setDescription(process.env.DESCRIPTION)
    .setVersion('')
    .addBearerAuth({ in: 'header', type: 'http' }, 'Token')
    .addSecurityRequirements('Token')
    .build();

  pipe = async (app: INestApplication<any>) => {
    try {
      app.useGlobalPipes(new ValidationPipe(this.validationConfig));
      this.logger.verbose(`Pipe was set up successfully`);
    } catch (error) {
      this.logger.error(`Pipe was set up failed`);
      this.flag++;
    }
  };

  swagger = async (app: INestApplication<any>, init: Init) => {
    try {
      const document = SwaggerModule.createDocument(app, this.configSwaggerA);
      SwaggerModule.setup('api', app, document, this.configSwaggerB);

      this.logger.verbose(
        `Swagger was set up successfully - access: ${init.host}:${init.port}/api`,
      );
    } catch (error) {
      console.log(error);
      this.logger.error(`Swagger was set up failed`);
      this.flag++;
    }
  };

  onInit = (app: INestApplication<any>): Init => {
    const configService = app.get(ConfigService);

    return {
      port: String(configService.get('PORT' as never)),
      prePort: 3100,
      enviroment: String(configService.get('NODE_ENV' as never)),
      user: String(configService.get('SWAGGER_USER' as never)),
      password: String(configService.get('SWAGGER_PASSWORD' as never)),
      host: String(configService.get('HOST' as never)),
    };
  };

  run = async () => {
    const app = await NestFactory.create(AppModule, this.config);
    app.useGlobalFilters(new HttpExceptionFilter());
    const init = this.onInit(app);

    console.clear();

    this.logger.fatal(`Environment ${init.enviroment || 'development'}`);
    this.logger.warn('Start config server');

    await this.pipe(app);
    await this.swagger(app, init);
    await app.listen(init.port || init.prePort, '0.0.0.0');

    if (!this.flag) {
      this.logger.warn('Config server done');
      this.logger.fatal(`Server is running`);
      this.logger.fatal(
        `Port: ${init.port || init.prePort}, Host: ${init.host}`,
      );
    } else {
      this.logger.error('Config server failed');
    }
  };
}

export default Main;
