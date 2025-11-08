import { Component, OnInit } from '@angular/core';
import { ProductResponse } from '../../../core/types/Products';
import { ProductsCardComponent } from "../products-card/products-card.component";
import { ProductsService } from '../../../core/services/products/products.service';
import { PlaceholderComponent } from "../../shared/placeholder/placeholder.component";
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [ProductsCardComponent, PlaceholderComponent, MatPaginatorModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit{
  productResponse!:ProductResponse;

  constructor(private productsService: ProductsService){}
  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(page:number=1, limit:number=16){
    this.productsService.getProducts(page, limit).subscribe({
      next:(data)=>{
        console.log(data);
        this.productResponse = data;
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
  onPageChange(event: PageEvent){
    console.log(event);
    this.getProducts(event.pageIndex, event.pageSize);
  }

  get skeletonArray(): number[] {
    const expectedCount = this.productResponse?.products?.length || 8;
    return Array(expectedCount).fill(0);
  }
  
  retryLoadProducts(): void {
    this.getProducts();
  }
 
}
