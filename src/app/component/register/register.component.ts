import { Component } from '@angular/core';
import { AuthService } from '../../service/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrl: "register.component.css",
  standalone: false
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isButtonDisabled: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (this.username && this.password) {
      this.isButtonDisabled = true;

      this.authService.register(this.username, this.password).subscribe(
        (response) => {
          this.router.navigate(['/registration-success']);  // Переходимо на сторінку успіху
        },
        (error) => {
          this.errorMessage = error.message;
          this.isButtonDisabled = false;
        }
      );
    }
  }


  onInputChange() {
    this.errorMessage = '';
  }
}
