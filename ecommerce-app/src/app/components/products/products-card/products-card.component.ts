import { Component, Input } from '@angular/core';
import { Product } from '../../../core/types/Products';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminDirective } from '../../../core/directives/admin.directive';
import { OfferDirective } from '../../../core/directives/offer/offer.directive';
import { CartService } from '../../../core/services/cart/cart.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-products-card',
  standalone: true,
  imports: [RouterLink, CommonModule, AdminDirective, OfferDirective],
  templateUrl: './products-card.component.html',
  styleUrl: './products-card.component.css',
})
export class ProductsCardComponent {
  @Input() product!: Product;
  constructor(private cartService: CartService) {}
  loading: boolean = false;

  addToCart() {
    this.loading = true;
    this.cartService.addToCart(this.product._id).pipe(take(1)).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      },
    });
  }
}
