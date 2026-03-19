import { IntersectionType, PickType } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';

export class CreateTaskDto extends PickType(Task, [
  'title',
  'due',
  'completedAt',
  'status',
] as const) {}

export class CreateTaskResponse extends IntersectionType(
  CreateTaskDto,
  PickType(Task, ['id', 'createdAt'] as const),
) {}
