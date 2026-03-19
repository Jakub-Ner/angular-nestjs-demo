import { PickType } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Task } from 'src/api/tasks/entities/task.entity';

class CursorData extends PickType(Task, ['id', 'createdAt'] as const) {}

function validateCursorData(data: unknown): CursorData {
  const cursor = plainToInstance(CursorData, data);
  const errors = validateSync(cursor);
  if (errors?.length > 0) {
    throw new Error(
      `Invalid cursor data: ${JSON.stringify(data)} Errors: ${JSON.stringify(errors)}`,
    );
  }
  return cursor;
}

export function encodeCursor(data: CursorData): string {
  const validatedData = validateCursorData(data);
  return Buffer.from(JSON.stringify(validatedData)).toString('base64');
}

export function decodeCursor(cursor: string): CursorData {
  const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(decoded);
  } catch (e) {
    throw new Error(`Malformed cursor data: ${e}`);
  }
  return validateCursorData(parsed);
}
