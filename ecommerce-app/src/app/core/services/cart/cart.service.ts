import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../store/auth/auth.selectors';
import { environment } from '../../../../environments/environment';
import { Cart, CartProduct } from '../../types/Cart';
import { ProductsService } from '../products/products.service';

// Helpers para acceder seguro a propiedades de product (puede ser string | object)
function getProductId(prod: string | { _id: string }): string {
  return typeof prod === 'string' ? prod : prod._id;
}

function getProductPrice(prod: string | { price?: number }): number {
  return typeof prod === 'string' ? 0 : (prod.price ?? 0);
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = `${environment.BACK_URL}/api/cart`;

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toast: ToastService,
    private store: Store,
    private productsService: ProductsService
  ) {
    // 🔥 GARANTIZA CARRITO INVITADO INICIAL
    const guest = localStorage.getItem('guestCart');

    if (!guest) {
      const empty = { _id: 'guest', user: null, products: [] };
      localStorage.setItem('guestCart', JSON.stringify(empty));
      this.cartSubject.next(empty);
    } else {
      this.cartSubject.next(JSON.parse(guest));
    }

    // Luego intenta cargar carrito del usuario si está logueado
    this.loadUserCart();
  }

  /** Obtener el ID del usuario (async para garantizar valor correcto) */
  private async getUserIdAsync(): Promise<string> {
    const id = await firstValueFrom(this.store.select(selectUserId).pipe(take(1)));
    return id ?? '';
  }

  /** Obtener el ID del usuario (síncrono, usa valor actual del BehaviorSubject) */
  private getUserIdSync(): string {
    let userId = '';
    this.store.select(selectUserId).pipe(take(1)).subscribe(id => {
      userId = id ?? '';
    });
    return userId;
  }

  /** Cargar carrito (usuario o invitado) */
  loadUserCart() {
    const userId = this.getUserIdSync();

    // Invitado
    if (!userId) {
      const guest = localStorage.getItem('guestCart');
      this.cartSubject.next(
        guest
          ? JSON.parse(guest)
          : { _id: 'guest', user: null, products: [] }
      );
      return;
    }

    // Usuario
    this.getCartByUserId(userId).subscribe({
      next: (cart) => this.cartSubject.next(cart),
      error: () => this.cartSubject.next(null),
    });
  }

  /** Backend */
  getCartByUserId(userId: string): Observable<Cart | null> {
    return this.http.get<Cart>(`${this.baseUrl}/user/${userId}`);
  }

  /** Guardar localStorage */
  private saveGuestCart(cart: Cart) {
    localStorage.setItem('guestCart', JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  /** 🔥 ADD / SUMAR / RESTAR */
  addToCart(productId: string, quantity: number): Observable<Cart | null> {
    const userId = this.getUserIdSync();

    /** MODO INVITADO */
    if (!userId) {
      let cart: Cart = this.cartSubject.value ?? {
        _id: 'guest',
        user: null,
        products: [],
      };

      if (!cart.products) cart.products = [];

      // Traemos el producto completo
      return this.productsService.getProductByID(productId).pipe(
        take(1),
        tap(realProduct => {
          const existing = cart.products.find(
            p => getProductId(p.product) === productId
          );

          if (existing) {
            existing.quantity += quantity;

            // Si baja a 0 → eliminar
            if (existing.quantity <= 0) {
              const idx = cart.products.findIndex(p => getProductId(p.product) === productId);
              if (idx >= 0) {
                cart.products.splice(idx, 1);
              }
            }
          } else {
            // Se agrega producto COMPLETO
            cart.products.push({
              product: {
                _id: realProduct._id,
                name: realProduct.name,
                price: realProduct.price,
                imagesUrl: realProduct.imagesUrl,
                maxPerOrder: realProduct.maxPerOrder,
              },
              quantity: quantity > 0 ? quantity : 1,
            });
          }

          this.saveGuestCart(cart);
          this.toast.success('Carrito actualizado');
        }),
        map(() => cart)
      );
    }

    /** MODO AUTENTICADO */
    return this.http
      .post<void>(`${this.baseUrl}/add-product`, {
        userId,
        productId,
        quantity,
      })
      .pipe(
        switchMap(() => this.getCartByUserId(userId)),
        tap(cart => {
          this.cartSubject.next(cart);
          this.toast.success('Carrito actualizado');
        }),
        catchError(() => of(null))
      );
  }

  /** 🔥 ELIMINAR PRODUCTO */
  removeFromCart(productId: string): Observable<Cart | null> {
    const userId = this.getUserIdSync();

    // Invitado
    if (!userId) {
      const cart = this.cartSubject.value;
      if (!cart) {
        this.toast.error('No hay carrito disponible');
        return of(null);
      }
      cart.products = cart.products.filter(
        p => getProductId(p.product) !== productId
      );
      this.saveGuestCart(cart);
      this.toast.success('Producto eliminado');
      return of(cart);
    }

    // Usuario
    return this.http
      .post<void>(`${this.baseUrl}/remove-product`, { userId, productId })
      .pipe(
        switchMap(() => this.getCartByUserId(userId)),
        tap(cart => {
          this.cartSubject.next(cart);
          this.toast.success('Producto eliminado');
        }),
        catchError((err) => {
          this.toast.error('Error al eliminar producto');
          console.error('Error removing product:', err);
          return of(null);
        })
      );
  }

  /** 🔥 TOTAL */
  getCartTotal(): Observable<number> {
    return this.cart$.pipe(
      map(cart => {
        if (!cart) return 0;
        return cart.products.reduce(
          (sum, item) => sum + getProductPrice(item.product) * item.quantity,
          0
        );
      })
    );
  }

  /** 🔥 NUMERO DE ITEMS */
  getItemCount(): Observable<number> {
    return this.cart$.pipe(
      map(
        cart =>
          cart?.products?.reduce(
            (sum, item) => sum + item.quantity,
            0
          ) ?? 0
      )
    );
  }

  /** 🔥 LIMPIAR CARRITO */
  clearCart(): Observable<null> {
    const userId = this.getUserIdSync();
    console.log('clearCart called with userId:', userId);

    // Limpia el state local
    this.cartSubject.next({
      _id: userId || 'guest',
      user: userId || null,
      products: [],
    });

    // Para invitado o si no hay userId: limpia solo localmente
    if (!userId || userId.trim() === '') {
      localStorage.removeItem('guestCart');
      this.toast.success('Carrito vaciado');
      return of(null);
    }

    // Para usuario autenticado: limpia localmente Y envía request al backend
    console.log('Sending clear-cart request to backend with userId:', userId);
    return this.http.post<Cart>(`${this.baseUrl}/clear-cart`, { userId })
      .pipe(
        tap(() => {
          this.toast.success('Carrito vaciado');
        }),
        map(() => null), // Devuelve null para mantener la consistencia del tipo Observable<null>
        catchError((err) => {
          this.toast.error('Error al vaciar el carrito en el servidor.');
          console.error('Error clearing authenticated cart:', err);
          return of(null); // Maneja el error, pero aún completa el observable
        })
      );
  }
}