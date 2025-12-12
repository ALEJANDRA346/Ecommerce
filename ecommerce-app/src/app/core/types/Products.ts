import z from 'zod';
import { Category } from './Category';

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  offer: number;
  stock: number;
  maxPerOrder?: number;

  // ✔ Ahora coincide con el backend
  imagesUrl: string[];

  // (Opcional si tu backend también enviaba uno viejo)
  imageUrl?: string;

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

  // ✔ Arreglado para aceptar imagesUrl del backend
  imagesUrl: z.array(z.string()).optional(),

  stock: z.number(),
  category: z.string(),
});
