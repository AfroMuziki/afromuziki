// frontend/src/utils/validators/form.validator.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username too long'),
  fullName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const contentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  description: z.string().max(5000, 'Description too long').optional(),
  genre: z.string().min(1, 'Please select a genre'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags'),
  isDownloadable: z.boolean().default(true),
  scheduledAt: z.date().optional(),
});

export const commentSchema = z.object({
  body: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment too long'),
});

export const reportSchema = z.object({
  reason: z.string().min(10, 'Please provide a detailed reason').max(500, 'Reason too long'),
});
