import z from 'zod';
import { Category } from './Category';

export type Product = {
  _id:string;
  name: string;
  description: string;
  price: number;
  offer: number;
  stock: number;
  imageUrl: string;
  category: Category;
};
export type ProductResponse = {
  products: Product[];
  pagination: {
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
    totalPages: number;
    totalResults: number;
  };
};

export const cartProductSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    price: z.number(),
    imageUrl: z.string().optional(),
    stock: z.number(),
    category: z.string(),
});
