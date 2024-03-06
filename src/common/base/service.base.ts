import { HttpStatus, Logger } from '@nestjs/common';
import { ContentEnum } from '../enum/content.enum';
import { ActionEnum } from '../enum/action.enum';
import { FieldEnum } from '../enum/field.enum';
import { Repository } from 'typeorm';
import { CustomBadRequestException } from '../exception/bad.exception';

export class BaseService<T> {
  protected name: string = '';
  protected field: FieldEnum = FieldEnum.INIT;
  protected action: ActionEnum = ActionEnum.INIT;
  private readonly logger = new Logger(this.name);

  constructor(private repository: Repository<T>) {}

  async catch(func: () => void, name: string) {
    try {
      return func();
    } catch (error) {
      this.logger.debug(this[name].name);
      this.logger.error(error);
    }
  }

  response(data: any) {
    return {
      message: [this.action + '.' + ContentEnum.SUCCESSFULLY],
      data: data,
      statusCode:
        this.action === ActionEnum.CREATE ? HttpStatus.CREATED : HttpStatus.OK,
      toast: true,
    };
  }

  reponseCustom(content: ContentEnum, field?: FieldEnum) {
    throw new CustomBadRequestException(
      content,
      field ? field : this.field,
      false,
    );
  }

  reponseCustomWithToast(content: ContentEnum, field?: FieldEnum) {
    throw new CustomBadRequestException(
      content,
      field ? field : this.field,
      true,
    );
  }
}
