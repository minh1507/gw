import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  // swagger
  @ApiProperty({
    description: 'Id',
    minimum: 1,
  })
  // validate
  @IsNotEmpty()
  @IsNumber({})
  @ApiProperty({
    description: 'Id',
  })
  // entity
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;

  @Column('int', { name: 'created_by', nullable: true })
  createdBy: number;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column('int', { name: 'updated_by', nullable: true })
  updatedBy: number;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  isFixed: boolean;
}
