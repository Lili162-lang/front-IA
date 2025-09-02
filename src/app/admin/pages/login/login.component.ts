import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../../shared/models/auth-tokens.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage: string | null = null;
  returnUrl = '/admin/products';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/products';
    
    // Add test credentials for development (remove in production)
    if (environment.production === false) {
      this.loginForm.patchValue({
        email: 'admin@test.com',
        password: 'password123'
      });
    }
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = null;

      const credentials: LoginRequest = this.loginForm.value;
      console.log('Attempting login with:', { email: credentials.email });

      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.isLoading = false;
          
          // Handle different error scenarios
          if (error.status === 0) {
            this.errorMessage = 'No se puede conectar al servidor. Verifique que el backend esté ejecutándose en https://10.72.4.32:7133';
          } else if (error.status === 401) {
            this.errorMessage = 'Credenciales incorrectas';
          } else if (error.status === 400) {
            this.errorMessage = 'Datos de login inválidos';
          } else if (error.status === 500) {
            this.errorMessage = 'Error interno del servidor';
          } else if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Error al conectar con el servidor';
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters for template
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
