import { Component, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./admin/components/nav-bar/nav-bar.component";
import { AuthService } from './admin/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Front-products';
  
  // Computed para verificar si está logueado
  isLoggedIn = computed(() => this.authService.isLoggedIn());

  constructor(private authService: AuthService) {}
}
