import { Component, ViewChild } from '@angular/core';
import { LoginFormComponent } from '../../components/auth/login-form/login-form.component';
import { canComponentDeactivate } from '../../core/guards/form/form.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements canComponentDeactivate{
  
  @ViewChild(LoginFormComponent) loginFormComponent!: LoginFormComponent;
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean{
    return this.loginFormComponent.canDeactivate() ?? true;
  };
}
