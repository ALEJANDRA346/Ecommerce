import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from '../../../core/services/products/products.service';
import { debounceTime, distinctUntilChanged, distinctUntilKeyChanged, map, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-search-products',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './search-products.component.html',
  styleUrl: './search-products.component.css'
})
export class SearchProductsComponent implements OnInit{
  
  searchProductForm = new FormGroup({
    q: new FormControl('', {nonNullable: true}), 
    minPrice: new FormControl(0, {nonNullable:true}),
    maxPrice: new FormControl(1000, {nonNullable:true})
  })

  searchConfig$ = this.searchProductForm.valueChanges.pipe(
    debounceTime(300),
    // distinctUntilKeyChanged('q'),
    distinctUntilChanged((prevValue,newValue)=>{
      return prevValue === newValue
    }),
    map((config)=>{
      const trimmedConfig ={
        ...config,
        q: config.q?.trim() || ''
      }
      localStorage.setItem('searchConfig', JSON.stringify(trimmedConfig))
      return trimmedConfig;
    })
  );

  products$ = this.searchConfig$.pipe(
    switchMap((searchConfigObservable)=>this.productService.searchProducts(searchConfigObservable))
  )


  constructor(private productService: ProductsService){}
  ngOnInit(): void {
    this.searchConfig$.subscribe({next: data => console.log(data)});
  }


}
