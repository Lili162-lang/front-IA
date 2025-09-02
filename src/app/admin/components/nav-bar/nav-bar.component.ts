import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  isMenuOpen = signal<boolean>(false);
  currentUser = signal<any>(null);
  
  // Computed para verificar si está logueado
  isLoggedIn = computed(() => this.authService.isLoggedIn());

  constructor(
    public router: Router,
    private authService: AuthService
  ) {
    // Obtener datos del usuario actual
    this.currentUser.set(this.authService.getCurrentUser());
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  navigateToProducts() {
    this.router.navigate(['/admin/products']);
    this.closeMenu();
  }

  navigateToNewProduct() {
    this.router.navigate(['/admin/products/new']);
    this.closeMenu();
  }

  navigateToCategories() {
    this.router.navigate(['/admin/categories']);
    this.closeMenu();
  }

  navigateToPanel() {
    this.router.navigate(['/admin/panel']);
    this.closeMenu();
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
  }

  getUserInitials(): string {
    const user = this.currentUser();
    if (user && user.name) {
      return user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    return 'AD';
  }

  getUserName(): string {
    const user = this.currentUser();
    return user?.name || 'Administrador';
  }
}
