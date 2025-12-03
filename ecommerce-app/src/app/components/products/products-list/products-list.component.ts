import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ProductsService } from '../../../core/services/products/products.service';
import { ProductsCardComponent } from '../products-card/products-card.component';
import { ProductResponse } from '../../../core/types/Products';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, ProductsCardComponent, MatPaginatorModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css',
})
export class ProductsListComponent implements OnInit {
  productResponse: ProductResponse | null = null;
  isLoading = false;
  hasError = false;

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(page: number = 1, limit: number = 16): void {
    this.isLoading = true;
    this.hasError = false;

    this.productsService.getProducts(page, limit).subscribe({
      next: (response) => {
        console.log('RESPUESTA PRODUCTS ====>', response);
        this.productResponse = response;
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
}
