import {Component} from "@angular/core";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrl: "register.component.css",
  standalone: false
})
export class RegisterComponent {
  username: string = "";
  password: string = "";
  errorMessage: string = "";
  isButtonDisabled: boolean = false;
  isPassStrong: boolean = false;

  constructor(private readonly authService: AuthService,
              private readonly router: Router) {
    sessionStorage.clear();
  }

  isPasswordStrong(password: string) {
    // Мінімум 6 символів, одна велика, одна мала, одна цифра
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    this.isPassStrong = pattern.test(password);
  }

  onRegister() {
    if (!(this.username && this.password)) {
      return;
    }

    this.isButtonDisabled = true;
    this.authService.register(this.username, this.password).subscribe({
      next: value => {
        sessionStorage.setItem("token", value.token);
        this.router.navigate(["/registration-success"]).then(r => console.debug(r));
      },
      error: err => console.error(err)
    });
  }

  onInputChange() {
    this.errorMessage = "";
    this.isPasswordStrong(this.password);
  }
}
