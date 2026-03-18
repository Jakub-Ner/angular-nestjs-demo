import Database from 'better-sqlite3';
import { faker } from '@faker-js/faker';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Simple TaskStatus enum matching the entity
enum TaskStatus {
  OPEN = 'OPEN',
  DONE = 'DONE',
}

interface TaskData {
  id: string;
  title: string;
  due: string | null;
  completedAt: string | null;
  status: TaskStatus;
}

const dbPath = path.resolve(__dirname, '../../db.sqlite');
const db = new Database(dbPath);

function seed() {
  console.log(`Seeding database at ${dbPath}...`);

  const insert = db.prepare(`
    INSERT INTO task (id, title, due, completedAt, status)
    VALUES (@id, @title, @due, @completedAt, @status)
  `);

  const insertMany = db.transaction((tasks: TaskData[]) => {
    for (const task of tasks) {
      insert.run(task);
    }
  });

  const tasks: TaskData[] = [];
  for (let i = 0; i < 1000; i++) {
    const status = faker.helpers.arrayElement([
      TaskStatus.OPEN,
      TaskStatus.DONE,
    ]);
    const isDone = status === TaskStatus.DONE;

    const task: TaskData = {
      id: uuidv4(),
      title: faker.lorem.sentence({ min: 3, max: 7 }).slice(0, 255),
      due: faker.date.future().toISOString(),
      completedAt: isDone ? faker.date.recent().toISOString() : null,
      status: status,
    };
    tasks.push(task);
  }

  insertMany(tasks);
  console.log('Successfully seeded 1000 tasks.');
  db.close();
}

seed();
