import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum TaskStatus {
  OPEN = 'OPEN',
  DONE = 'DONE',
}

@Entity()
@Index(['createdAt', 'id'])
export class Task {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 255,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  @IsOptional()
  @IsDateString()
  due?: Date;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  @IsOptional()
  @IsDateString()
  completedAt?: Date;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.OPEN })
  @Column({
    type: 'varchar',
  })
  @IsEnum(TaskStatus)
  status: TaskStatus = TaskStatus.OPEN;
}
