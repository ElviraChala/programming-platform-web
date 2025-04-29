import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../service/AuthService";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "login.component.css",
  standalone: false
})
export class LoginComponent {
  username: string = "";
  password: string = "";
  errorMessage: string = "";
  isButtonDisabled: boolean = false;

  constructor(private readonly authService: AuthService,
              private readonly router: Router) {
    sessionStorage.clear();
  }

  onLogin() {
    if (this.username && this.password) {
      this.isButtonDisabled = true;

      this.authService.login(this.username, this.password).subscribe({
        next: response => {
          sessionStorage.setItem("token", response.token);
          this.router.navigate(["/courses"]).then(console.debug);
        },
        error: err => {
          this.errorMessage = err.message;
          this.isButtonDisabled = false;
        }
      });
    }
  }

  onInputChange() {
    this.errorMessage = "";
  }
}
