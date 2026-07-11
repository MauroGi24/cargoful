import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Username obbligatorio')
    .min(3, 'Username deve avere almeno 3 caratteri'),
  password: z
    .string()
    .min(1, 'Password obbligatoria')
    .min(6, 'Password deve avere almeno 6 caratteri'),
});
