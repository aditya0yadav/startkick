import { z } from 'zod';

export const userProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  jobTitle: z.string().optional(),
  location: z.string().optional(),
  profileImage: z.string().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});