import { Component, inject } from '@angular/core';
import { FormFieldComponent } from '../../shared/form-field/form-field.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FormErrorService } from '../../../core/services/validation/form-error.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormFieldComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  fb = inject(FormBuilder);
  loginForm: FormGroup;

  constructor(
    private validation: FormErrorService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  getErrorMessage(fieldName: string) {
    const loginLabels = {
      email: 'email',
      password: 'contraseña',
    };
    return this.validation.getFieldError(this.loginForm, fieldName, loginLabels);
  }

  handleSubmit() {
    if (this.loginForm.invalid) return;
    console.log('LoginForm submit:', this.loginForm.value); // 👈 debug
    this.authService.login(this.loginForm.value);
  }


  // 👇 MÉTODO NUEVO para que el guard lo pueda llamar
  canDeactivate(): boolean {
    // Versión simple: siempre permite salir de la página
    return true;

    // Versión un poco más “pro” (opcional):
    // return !this.loginForm.dirty;
  }
}
