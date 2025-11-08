import { Component, OnInit } from '@angular/core';
import { Observable, of, take } from 'rxjs';
import { CartService } from '../../../core/services/cart/cart.service';
import { Cart } from '../../../core/types/Cart';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cart$: Observable<Cart | null> = of(null);
  cartTotal$: Observable<number> = of(0);
  cartItemCount$: Observable<number> = of(0);
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$;
    this.cartTotal$ = this.cartService.getCartTotal();
    this.cartItemCount$ = this.cartService.getItemCount();
  }
  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId).subscribe();
  }
  increaseQuantity(
    productId: string,
    curretQunatity: number,
    maxStock: number
  ) {
    if (curretQunatity >= maxStock) {
      return;
    }
    this.updateQuatity(productId, 1);
  }
  decreaseQuantity(productId: string, curretQunatity: number) {
    if (curretQunatity <= 1) {
      this.removeFromCart(productId);
      return;
    }
    this.updateQuatity(productId, -1);
  }

  updateQuatity(productId: string, quantity: number) {
    this.cartService.addToCart(productId, quantity).pipe(take(1)).subscribe();
  }

    /**
   * Verificar si se puede incrementar la cantidad
   */
  canIncrease(currentQuantity: number, maxStock: number): boolean {
    return currentQuantity < maxStock;
  }

  /**
   * Verificar si se puede decrementar la cantidad
   */
  canDecrease(currentQuantity: number): boolean {
    return currentQuantity > 0;
  }

  /**
   * Verificar si el producto está agotado
   */
  isOutOfStock(stock: number): boolean {
    return stock === 0;
  }

  /**
   * Verificar si el stock es bajo
   */
  isLowStock(stock: number): boolean {
    return stock <= 5 && stock > 0;
  }

  cleanCart() {
    this.cartService.clearCart().pipe(take(1)).subscribe();
  }
}
