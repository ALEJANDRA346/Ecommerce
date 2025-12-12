import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { ProductsService } from '../../../core/services/products/products.service';
import { ProductsCardComponent } from '../products-card/products-card.component';
import { ProductResponse, Product } from '../../../core/types/Products';
import { PlaceholderComponent } from '../../shared/placeholder/placeholder.component';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductsCardComponent,
    MatPaginatorModule,
    PlaceholderComponent,
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css',
})
export class ProductsListComponent implements OnInit {
  productResponse: ProductResponse | null = null;
  isLoading = false;
  hasError = false;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  /** 🔥 CORRECCIÓN IMPORTANTE: Mapear productos del backend */
  getProducts(page: number = 1, limit: number = 16): void {
    this.isLoading = true;
    this.hasError = false;

    this.productsService.getProducts(page, limit).subscribe({
      next: (response) => {
        console.log('RESPUESTA PRODUCTS ====>', response);

        /** 🔥 Transformación para evitar undefined en las cards */
        const normalizedProducts: Product[] = response.products.map((p: any) => ({
          ...p,
          imageUrl: p.imageUrl ?? p.imagesUrl?.[0] ?? '', // 👈 asegurar imagen
          description: p.description ?? '',               // 👈 evitar undefined
          price: p.price ?? 0,                            // 👈 evitar undefined
          stock: p.stock ?? 0,                            // 👈 evitar undefined
        }));

        this.productResponse = {
          ...response,
          products: normalizedProducts,
        };

        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar productos', error);
        this.isLoading = false;
        this.hasError = true;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.getProducts(event.pageIndex + 1, event.pageSize);
  }

  get skeletonArray(): number[] {
    const count = this.productResponse?.products?.length || 8;
    return Array(count).fill(0);
  }

  retryLoadProducts(): void {
    this.getProducts();
  }
}
