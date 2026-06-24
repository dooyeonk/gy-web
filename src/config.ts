import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  SERVICE_SECRET: z.string(),
  MAX_CHARACTERS: z.coerce.number().default(8),
  PORT: z.coerce.number().default(3000),
});

export const config = schema.parse(process.env);
