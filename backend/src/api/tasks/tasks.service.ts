import { Injectable } from '@nestjs/common';
import { CreateTaskDto, CreateTaskResponse } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './tasks.repository';
import { GetTasksDto, GetTasksResponse } from './dto/get-tasks-dto';
import { decodeCursor, encodeCursor } from 'src/common/pagination-cursor';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  create(createTaskDto: CreateTaskDto): Promise<CreateTaskResponse> {
    return this.tasksRepository.create(createTaskDto);
  }

  async findAll({
    limit,
    cursor,
    status,
  }: GetTasksDto): Promise<GetTasksResponse> {
    const query = this.tasksRepository
      .createQueryBuilder()
      .orderBy('task.createdAt', 'DESC')
      .addOrderBy('task.id', 'DESC')
      .take(limit + 1);

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (cursor) {
      const { id, createdAt } = decodeCursor(cursor);
      query.andWhere(
        '(task.createdAt < :createdAt) OR (task.createdAt = :createdAt AND task.id < :id)',
        { createdAt, id },
      );
    }
    const tasks = await query.getMany();

    const hasMore = tasks.length > limit;
    let nextCursor: string | null = null;
    if (hasMore) {
      tasks.pop();
      const { id, createdAt } = tasks[tasks.length - 1];
      nextCursor = encodeCursor({ id, createdAt });
    }
    return { data: tasks, meta: { nextCursor, hasMore } };
  }

  async findOne(id: string): Promise<Task> {
    return this.tasksRepository.findOne(id);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.tasksRepository.update(id, updateTaskDto);
  }

  async remove(id: string): Promise<void> {
    return this.tasksRepository.remove(id);
  }
}
