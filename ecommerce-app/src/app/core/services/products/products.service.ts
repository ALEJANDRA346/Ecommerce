import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError, } from 'rxjs';
import { Product, ProductResponse } from '../../types/Products';
import { environment } from '../../../../environments/environment';

export type filters = {
  q: string;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
};

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  private baseUrl = `${environment.BACK_URL}/api/products`;

  // 🔥 State Management (Rubric III.1)
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  getProducts(page: number = 1, limit: number = 10) {
    console.log('GET PRODUCTS to', this.baseUrl, { page, limit });
    return this.httpClient
      .get<ProductResponse>(this.baseUrl, { params: { page, limit } })
      .pipe(
        tap({
          next: (r) => {
            console.log("RESPONSE OK", r);
            this.productsSubject.next(r.products); // Update state
          },
          error: (e) => console.log("RESPONSE ERROR", e)
        }),
        catchError((error) => throwError(() => new Error(error)))
      );
  }


  getProductByID(id: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseUrl}/${id}`);
  }

  // Example of using state for search if needed, or just returning observable
  searchProducts(searchConfig: filters): Observable<Product[]> {
    let filters: filters = {
      q: searchConfig.q
    }
    if (searchConfig.minPrice) {
      filters.minPrice = searchConfig.minPrice;
    }
    if (searchConfig.maxPrice) {
      filters.maxPrice = searchConfig.maxPrice;
    }
    const params = new HttpParams({ fromObject: filters });
    return this.httpClient.get<ProductResponse>(`${this.baseUrl}/search`, { params }).pipe(
      map(response => {
        return response.products;
      })
    )

  }
}
