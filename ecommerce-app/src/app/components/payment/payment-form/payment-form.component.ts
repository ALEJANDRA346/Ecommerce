import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PaymentMethod } from '../../../core/types/PaymentMethod';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from "../../shared/form-field/form-field.component";
import { FormErrorService } from '../../../core/services/validation/form-error.service';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.css'
})
export class PaymentFormComponent implements OnChanges {
  @Input() payment: PaymentMethod | null = null;
  @Input() isEditMode: boolean = false;
  @Output() paymentSaved = new EventEmitter<PaymentMethod>();

  paymentForm: FormGroup;
  
  private formErrorService = inject(FormErrorService);

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['payment'] && this.payment) {
      this.populateForm();
    }
  }

  createForm() {
    return this.fb.group({
      type: ['', [Validators.required]],
      cardNumber: [''],
      cardHolderName: [''],
      expiryDate: [''],
      paypalEmail: ['', [Validators.email]],
      bankAccount: [''],
      cashDetails: ['']
    });
  }

  private populateForm(): void {
    if (!this.payment) return;
    this.paymentForm.patchValue({
      type: this.payment.type || '',
      cardNumber: this.payment.cardNumber || '',
      cardHolderName: this.payment.cardHolderName || '',
      expiryDate: this.payment.expiryDate || '',
      paypalEmail: this.payment.paypalEmail || '',
      bankAccount: this.payment.bankName || '',
    });
  }

  getFieldError(fieldName: string): string {
    const customLabels = {
      type: 'Tipo de pago',
      cardNumber: 'Número de tarjeta',
      cardHolderName: 'Titular de la tarjeta',
      expiryDate: 'Fecha de expiración',
      paypalEmail: 'Email de PayPal',
      bankAccount: 'Cuenta bancaria'
    };
    
    return this.formErrorService.getFieldError(this.paymentForm, fieldName, customLabels);
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      
      return;
    }

    const form = this.paymentForm.value;
    const formData: PaymentMethod = {
      _id: this.payment?._id ?? '',
      type: form.type,
      cardNumber: form.cardNumber || '',
      cardHolderName: form.cardHolderName || '',
      expiryDate: form.expiryDate || '',
      paypalEmail: form.paypalEmail || '',
      bankName: form.bankAccount || '',
      accountNumber: this.payment?.accountNumber || '',
      isDefault: this.payment?.isDefault ?? false,
      isActive: this.payment ? this.payment.isActive : true
    };

    this.paymentSaved.emit(formData);
  }
}
