import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

const envVarsSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DB_PATH: Joi.string().default('db.sqlite'),
});

export const configModule = ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: envVarsSchema,
  validationOptions: {
    abortEarly: true,
    allowUnknown: true,
  },
});
