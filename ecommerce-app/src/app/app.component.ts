import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchProductsComponent } from "./components/products/search-products/search-products.component";
import { AsideComponent } from "./layout/aside/aside.component";
import { ToastComponent } from "./components/shared/toast/toast.component";
import { Store } from '@ngrx/store';
import * as AuthActions from './core/store/auth/auth.actions'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchProductsComponent, AsideComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'ecommerce-app';
  constructor(private readonly store: Store){}
  ngOnInit(): void {
    this.store.dispatch(AuthActions.initializeAuth());
  }
}
