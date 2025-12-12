import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {

  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);

  product: any = null;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.productsService.getProductByID(id).subscribe({
      next: (res: any) => this.product = res,
      error: (err: any) => console.error(err),
    });
  }

  getImage(p: any): string {
    return p?.imagesUrl?.length
      ? p.imagesUrl[0]
      : 'https://via.placeholder.com/600?text=No+image';
  }

  addToCart() {
    this.cartService.addToCart(this.product._id, 1).subscribe();
  }
}
