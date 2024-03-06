import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseEntity } from '../../../../common/base/enitity.base';

@Entity()
export class Role extends BaseEntity {
  // swagger
  @ApiProperty({
    description: 'Mã',
    default: 'Mã 1',
    maxLength: 25,
  })
  // validate
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  // entity
  @Column('varchar', { length: 25, nullable: false })
  code: string;

  // swagger
  @ApiProperty({
    description: 'Tên',
    default: 'Tên 1',
    maxLength: 100,
  })
  // validate
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  // entity
  @Column('varchar', { length: 100, nullable: false })
  name: string;

  // swagger
  @ApiProperty({
    description: 'Mô tả',
    default: 'Mô tả 1',
    maxLength: 1000,
  })
  // validate
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  // entity
  @Column('varchar', {
    length: 1000,
    nullable: true,
  })
  description: string;
}
