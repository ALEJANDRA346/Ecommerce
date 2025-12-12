import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/types/Products';
import { AdminDirective } from '../../../core/directives/admin.directive';
import { OfferDirective } from '../../../core/directives/offer/offer.directive';
import { CartService } from '../../../core/services/cart/cart.service';
import { CartProduct } from '../../../core/types/Cart';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products-card.component.html',
  styleUrl: './products-card.component.css',
})
export class ProductsCardComponent implements OnInit, OnDestroy {

  @Input() product!: Product;

  loading = false;
  cartItem: CartProduct | null = null; // <-- Añade esta línea
  private subscription: Subscription = new Subscription(); // <-- Añade esta línea

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // <-- Añade esta lógica para suscribirse al carrito
    this.subscription.add(
      this.cartService.cart$.subscribe(cart => {
        if (cart) {
          this.cartItem = cart.products.find(p => p.product._id === this.product._id) || null;
        } else {
          this.cartItem = null;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // <-- Añade esta línea
  }

  getImage(p: Product): string {
    return p?.imagesUrl?.length
      ? p.imagesUrl[0]
      : 'https://via.placeholder.com/300?text=No+image';
  }

  addToCart(): void {
    this.loading = true;
    this.cartService.addToCart(this.product._id, 1).subscribe({
      next: () => this.loading = false,
      error: () => this.loading = false,
    });
  }

  // <-- Añade estos métodos
  increase(): void {
    if (this.cartItem) {
      this.cartService.addToCart(this.product._id, 1).subscribe();
    }
  }

  decrease(): void {
    if (this.cartItem && this.cartItem.quantity > 1) {
      this.cartService.addToCart(this.product._id, -1).subscribe();
    } else if (this.cartItem && this.cartItem.quantity === 1) {
      this.remove();
    }
  }

  remove(): void {
    this.cartService.removeFromCart(this.product._id).subscribe();
  }
}