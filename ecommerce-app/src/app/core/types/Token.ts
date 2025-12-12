import z from 'zod';

export const tokenSchema = z.object({
  token: z.string(),
  refreshToken: z.string().optional(),
});

export type token = z.infer<typeof tokenSchema>;
