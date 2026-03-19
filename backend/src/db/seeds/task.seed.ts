import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { getAppConfig } from '../../config';
import { TaskStatus, Task } from '../../api/tasks/entities/task.entity';

const config = getAppConfig();
const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.DATABASE_URL,
  entities: [Task],
  synchronize: true,
});

async function seed(): Promise<void> {
  await AppDataSource.initialize();
  if (config.ENV === 'test') {
    await AppDataSource.synchronize(true);
  }
  const taskRepo = AppDataSource.getRepository(Task);

  const tasks: Task[] = [];

  const taskStatuses = Object.values(TaskStatus);
  for (let i = 0; i < 1000; i++) {
    const status = faker.helpers.arrayElement(taskStatuses);
    const isDone = status === TaskStatus.DONE;

    const task = taskRepo.create();

    task.id = uuidv4();
    task.title = faker.lorem.sentence({ min: 3, max: 7 }).substring(0, 255);
    task.status = status;

    if (faker.datatype.boolean()) {
      task.due = faker.date.future();
    }

    if (isDone) {
      task.completedAt = faker.date.recent();
    }
    tasks.push(task);
  }

  console.log('Inserting validated tasks into database...');
  await taskRepo.save(tasks, { chunk: 100 });

  console.log('Successfully seeded 1000 tasks.');
  await AppDataSource.destroy();
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error seeding data:', error);
    process.exit(1);
  });
