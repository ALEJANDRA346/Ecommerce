// import { Product } from './Products';

// export type Cart = {
//   user: {
//     _id: string;
//   };
//   products: [
//     {
//       product: Product;
//       quantity: number;
//     }
//   ];
// };

import {z} from 'zod';
import { cartProductSchema } from './Products';
import { userSchema } from './User';

export const cartSchema = z.object({
    _id: z.string(),
    user: userSchema,
    products: z.array(z.object({product: cartProductSchema , quantity: z.number().min(1)})),
    
});
export const cartArraySchema = z.array(cartSchema);

export type Cart = z.infer<typeof cartSchema>;

