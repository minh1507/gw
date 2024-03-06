import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../../common/base/enitity.base';
import { Role } from '../../role/entities/role.entity';
import { Password } from '../../password/entities/password.entity';
import { RelationTypeBase } from '../../../../common/base/param.base';

@Entity()
export class Account extends BaseEntity {
  @ApiProperty({
    description: 'Tên tài khoản',
    default: 'admin',
  })
  @IsNotEmpty()
  @Column('varchar', { length: 100, unique: true, nullable: false })
  username: string;

  @ApiProperty({
    description: 'Id cấp hành chính',
    default: 'admin',
  })
  @IsNotEmpty()
  @Column('varchar', { length: 100, nullable: false })
  fullname: string;

  @ApiProperty({
    description: 'Số điện thoại',
    default: '0000000000',
  })
  @IsNotEmpty()
  @Column('varchar', { length: 15, nullable: true })
  phoneNumber: string;

  @ApiProperty({
    description: 'Vai trò',
    type: RelationTypeBase,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PickType(Role, ['id']))
  @ManyToOne(() => Role)
  @JoinColumn()
  role: Role;

  @OneToOne(() => Password, (item) => item.account)
  password: Password;

  accessTokenKey: string;

  refreshTokenKey: string;
}
