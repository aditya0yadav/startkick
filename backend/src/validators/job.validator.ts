import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(3).max(100),
  company: z.string().min(2).max(100),
  description: z.string().min(10),
  location: z.string(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  requiredSkills: z.string().optional()
});