import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  jobTitle: z.string().optional(),
  location: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});