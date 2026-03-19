import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { GetTasksResponse } from '../src/api/tasks/dto/get-tasks-dto';

interface TaskItem {
  id: string;
  title: string;
  status: string;
  due: string | null;
  completedAt: string | null;
  createdAt: string;
}

interface TasksResponse {
  body: GetTasksResponse & { data: TaskItem[] };
}

describe('Tasks (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  describe('GET /tasks - cursor pagination', () => {
    it('should return tasks with cursor pagination', async () => {
      const response = (await request(app.getHttpServer())
        .get('/tasks')
        .query({ limit: 10 })
        .expect(200)) as TasksResponse;

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeLessThanOrEqual(10);
      expect(response.body.meta).toHaveProperty('nextCursor');
      expect(response.body.meta).toHaveProperty('hasMore');
    });

    it('should return different tasks when using nextCursor', async () => {
      const limit = 20;

      const firstPage = (await request(app.getHttpServer())
        .get('/tasks')
        .query({ limit })
        .expect(200)) as TasksResponse;

      expect(firstPage.body.data.length).toBeGreaterThan(0);
      expect(firstPage.body.meta.hasMore).toBe(true);

      const firstPageIds = firstPage.body.data.map((t: TaskItem) => t.id);
      const nextCursor = firstPage.body.meta.nextCursor;

      const secondPage = (await request(app.getHttpServer())
        .get('/tasks')
        .query({ limit, cursor: nextCursor })
        .expect(200)) as TasksResponse;

      expect(secondPage.body.data.length).toBeGreaterThan(0);
      const secondPageIds = secondPage.body.data.map((t: TaskItem) => t.id);

      const commonIds = firstPageIds.filter((id: string) =>
        secondPageIds.includes(id),
      );

      expect(commonIds.length).toBe(0);
      expect(secondPage.body.meta.nextCursor).toBeDefined();
    });

    it('should paginate through multiple pages correctly', async () => {
      const limit = 20;
      let cursor: string | undefined = undefined;
      let pageCount = 0;
      const allIds: string[] = [];
      let hasMore = true;

      while (hasMore && pageCount < 10) {
        const response = (await request(app.getHttpServer())
          .get('/tasks')
          .query({ limit, cursor })
          .expect(200)) as TasksResponse;

        const pageIds = response.body.data.map((t: TaskItem) => t.id);
        allIds.push(...pageIds);

        expect(response.body.data.length).toBeGreaterThan(0);
        const uniquePageIds = new Set(pageIds);
        expect(uniquePageIds.size).toBe(pageIds.length);

        cursor = response.body.meta.nextCursor ?? undefined;
        hasMore = response.body.meta.hasMore;
        pageCount++;
      }

      expect(allIds.length).toBeGreaterThan(0);

      const uniqueIds = new Set(allIds);
      expect(uniqueIds.size).toBe(allIds.length);
    });

    it('should respect the limit parameter', async () => {
      const limit = 5;
      const response = (await request(app.getHttpServer())
        .get('/tasks')
        .query({ limit })
        .expect(200)) as TasksResponse;

      expect(response.body.data.length).toBeLessThanOrEqual(limit);
    });

    it('should return  400 due to exceeding limit', async () => {
      const limit = 1000;
      (await request(app.getHttpServer())
        .get('/tasks')
        .query({ limit })
        .expect(400)) as TasksResponse;
    });

    it('should handle large limit', async () => {
      const limit = 100;
      const response = (await request(app.getHttpServer())
        .get('/tasks')
        .query({ limit })
        .expect(200)) as TasksResponse;

      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data.length).toBeLessThanOrEqual(limit);
    });
  });
});
