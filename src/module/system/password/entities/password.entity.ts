import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../../common/base/enitity.base';
import { Account } from '../../account/entities/account.entity';

@Entity()
export class Password extends BaseEntity {
  @ApiProperty({
    description: 'password',
    default: '12345678',
  })
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(8)
  @Column('varchar', { length: 60, nullable: true })
  hash: string;

  @OneToOne(() => Account, (item) => item.password)
  @JoinColumn()
  account: Account;
}
