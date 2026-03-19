import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

const envVarsSchema = z.object({
  PORT: z.coerce.number().default(3000),
  ENV: z.enum(['development', 'production', 'test']).default('test'),
  DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgres@localhost:5432/todo_app'),
});

type AppConfig = z.infer<typeof envVarsSchema>;

export const getAppConfig = (): AppConfig => {
  return envVarsSchema.parse(process.env);
};

export const configModule = ConfigModule.forRoot({
  isGlobal: true,
  validate: (config) => {
    return envVarsSchema.parse(config);
  },
});
