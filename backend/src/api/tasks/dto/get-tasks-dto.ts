import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTaskResponse } from './create-task.dto';

export class GetTasksDto {
  @ApiProperty({
    required: false,
    default: 20,
    minimum: 1,
    maximum: 100,
    description: 'Limit of tasks per page',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number = 20;

  @ApiProperty({
    required: false,
    description: 'Cursor for pagination',
  })
  @IsOptional()
  @IsString()
  cursor?: string;
}

export class GetTasksResponseMeta {
  @ApiProperty({
    nullable: true,
    description: 'Next cursor for pagination',
  })
  nextCursor: string | null;

  @ApiProperty({
    description: 'True if more tasks are available',
  })
  hasMore: boolean;
}

export class GetTasksResponse {
  @ApiProperty({
    type: [CreateTaskResponse],
    description: 'Array of tasks',
  })
  data: CreateTaskResponse[];

  @ApiProperty({
    type: GetTasksResponseMeta,
    description: 'Pagination metadata',
  })
  meta: GetTasksResponseMeta;
}
