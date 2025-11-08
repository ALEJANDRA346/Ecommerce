import z from 'zod';

export const userSchema = z.object({
  _id: z.string(),
  displayName: z.string(),
  userName: z.string().optional().nullable(), // optional -> undefined | nulleable -> null
  email: z.string(),
  role: z.enum(['admin', 'customer']),
  avatar: z.string(),
  phone: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  isActive: z.boolean(),
});

export const userArraySchema = z.array(userSchema);

export type User = z.infer<typeof userSchema>;

// export type userCerdentials = {email:string, password:string}
export type UserCredentials = Pick<User, 'email'> & { password: string };

export type UserForm = Pick<
  User,
  'email' | 'avatar' | 'dateOfBirth' | 'displayName' | 'phone'
> & { password: string };
