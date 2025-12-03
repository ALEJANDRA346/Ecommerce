import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../core/services/orders/order.service';

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
  private router = inject(Router);

  checkoutForm = this.fb.group({
    address: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['', Validators.required],
    paymentMethod: ['card', Validators.required],
  });

  onSubmit() {
    if (this.checkoutForm.invalid) return;

    this.orderService.createOrder(this.checkoutForm.value).subscribe({
      next: () => {
        this.router.navigate(['/user/profile']);
      },
      error: (err: any) => {
        console.error('Error al crear pedido', err);
      },
    });

  }
}
