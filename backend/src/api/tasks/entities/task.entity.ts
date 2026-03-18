import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum TaskStatus {
  OPEN = 'OPEN',
  DONE = 'DONE',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsDateString()
  due?: Date;

  @Column({ nullable: true })
  @IsOptional()
  @IsDateString()
  completedAt?: Date;

  @Column({
    type: 'varchar',
  })
  @IsEnum(TaskStatus)
  status: TaskStatus = TaskStatus.OPEN;
}
