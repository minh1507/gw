import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import ResponseHelper from '../util/response.util';
import { ContentEnum } from '../enum/content.enum';
import { FieldEnum } from '../enum/field.enum';

export class PathDto {
  @ApiProperty({
    description: 'Id',
  })
  @IsNotEmpty({
    message: ResponseHelper.response(
      FieldEnum.PATH_VARIABLE,
      ContentEnum.REQUIRED,
    ),
  })
  @IsNumber(
    {},
    {
      message: ResponseHelper.response(
        FieldEnum.PATH_VARIABLE,
        ContentEnum.INVALID,
      ),
    },
  )
  id: number;
}

export class RelationTypeBase {
  @ApiProperty({
    description: 'Id',
    name: 'id',
    required: true,
    default: 1,
  })
  id: number;
}
