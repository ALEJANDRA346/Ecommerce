import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from '../../components/products/products-list/products-list.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductsListComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}
}
