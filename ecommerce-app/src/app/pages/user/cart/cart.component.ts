import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart/cart.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { ToastService } from '../../../core/services/toast/toast.service'; // <-- Añade esta línea

@Component({
  selector: 'app-user-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  private cartService = inject(CartService);
  private router = inject(Router);
  private toast = inject(ToastService); // <-- Añade esta línea

  cart$ = this.cartService.cart$;
  total$ = this.cartService.getCartTotal();

  increase(productId: string) {
    this.cartService.addToCart(productId, 1).pipe(take(1)).subscribe();
  }

  decrease(productId: string, qty: number) {
    this.cartService.addToCart(productId, -1).pipe(take(1)).subscribe({
      next: () => {
        // Optional: Add a success toast here if needed
        // this.toast.success('Quantity decreased');
      },
      error: (err) => {
        this.toast.error('Error decreasing quantity.');
        console.error('Error decreasing quantity:', err);
      }
    });
  }

  remove(productId: string) {
    this.cartService.removeFromCart(productId).pipe(take(1)).subscribe();
  }

  clearCart() {
    this.cartService.clearCart().pipe(take(1)).subscribe();
  }

  goCheckout() {
    this.router.navigate(['/checkout']);
  }

  getImage(p: any): string {
    return p?.imagesUrl?.length
      ? p.imagesUrl[0]
      : 'https://via.placeholder.com/200?text=Sin+imagen';
  }
}