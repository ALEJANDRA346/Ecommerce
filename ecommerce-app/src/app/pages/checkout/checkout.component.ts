import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../core/services/orders/order.service';
import { CartService } from '../../core/services/cart/cart.service';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../core/store/auth/auth.selectors';
import { Cart } from '../../core/types/Cart';
import { combineLatest, take } from 'rxjs'; // <-- Añade combineLatest

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {

  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private store = inject(Store);
  cart: Cart | null = null;

  constructor() {
    // Suscribirse al carrito
    this.cartService.cart$.subscribe(c => {
      this.cart = c;
    });
  }

  checkoutForm = this.fb.group({
    address: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['', Validators.required],
    paymentMethod: ['card', Validators.required],
  });

  onSubmit() {
    if (this.checkoutForm.invalid) return;

    // Esperar userId y cart juntos
    combineLatest([
      this.store.select(selectUserId),
      this.cartService.cart$
    ]).pipe(take(1)).subscribe(([userId, cart]) => {

      if (!cart || cart.products.length === 0) return;

      // Transformar productos
      const orderItems = cart.products.map(item => ({
        productId: typeof item.product === 'string' ? item.product : item.product._id,
        price: typeof item.product === 'string' ? 0 : (item.product.price ?? 0),
        quantity: item.quantity
      }));

      // Payload
      // En onSubmit, cambia el orderPayload:
const orderPayload = {
  user: userId,
  products: orderItems,
  shippingAddress: {
    address: this.checkoutForm.value.address,
    city: this.checkoutForm.value.city,
    postalCode: this.checkoutForm.value.postalCode,
    country: this.checkoutForm.value.country,
  }, // objeto real
  paymentMethod: {
    type: this.checkoutForm.value.paymentMethod,
  }, // objeto real
  shippingCost: 0
};
      // Crear orden
      this.orderService.createOrder(orderPayload).subscribe({
        next: () => {
          this.cartService.clearCart().subscribe(); // limpiar carrito
          this.router.navigate(['/user/profile']);
        },
        error: (err) => {
          console.error('Error al crear pedido', err);
        }
      });
    });
  }
}