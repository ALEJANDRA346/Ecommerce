export interface CartProduct {
  product: {
    _id: string;
    name?: string;
    price: number;
    imagesUrl?: string[];
    maxPerOrder?: number;
    stock?: number;
  };
  quantity: number;
}

export interface Cart {
  _id: string;
  user?: string | null;
  anonymousId?: string | null;
  products: CartProduct[];
  createdAt?: string;
  updatedAt?: string;
}