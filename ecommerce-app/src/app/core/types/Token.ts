import z from 'zod';

export const tokenSchema = z.object({
   token: z.string(),
   refreshToken: z.string()
}); 

export type token = z.infer<typeof tokenSchema>; 


export type decodedToken = {
  userId: string;
  displayName: string;
  role: 'admin' | 'customer' | 'guest';
};