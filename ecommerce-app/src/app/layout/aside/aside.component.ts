import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { SideMenuComponent } from '../../components/sidebar/side-menu/side-menu.component';
import { routeItem } from '../../components/sidebar/menu-item/menu-item.component';
import { AdminDirective } from '../../core/directives/admin.directive';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectDecodedToken } from '../../core/store/auth/auth.selectors';
import { Logout } from '../../core/store/auth/auth.actions';
import { decodedToken } from '../../core/types/Token';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [CommonModule, SideMenuComponent, AdminDirective],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})
export class AsideComponent implements OnInit {
  sideBarOpen: boolean = false;

  routes: routeItem[] = [
    { title: 'Inicio', route: '', textColor: 'text-green-200' },
    { title: 'Productos', route: '/products' },
    { title: 'Categorias', route: '/categories' },
  ];

  adminRoutes: routeItem[] = [
    { title: 'Productos', route: '/admin/products' },
    { title: 'Usuarios', route: '/admin/users' },
    { title: 'Categorias', route: '/admin/categories' },
    { title: 'Compras', route: '/admin/purchases' },
  ];

  authRoutes: routeItem[] = [
    { title: 'mi perfil', route: '/user' },
    { title: 'mi carrito', route: '/user/cart' },
    { title: 'direcciones de envio', route: '/user/shipping_address' },
    { title: 'metodos de pago', route: '/user/paymethods' },
    { title: 'lista de deseos', route: '/user/wishlist' },
  ];

  notAuthRoutes: routeItem[] = [
    { title: 'iniciar sesion', route: '/login' },
    { title: 'registro', route: '/register' },
  ];
  user$: Observable<decodedToken | null> = of(null);

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.user$ = this.store.select(selectDecodedToken);
  }
  
  logout(){
    this.store.dispatch(Logout());
  }
}
