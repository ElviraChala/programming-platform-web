import { Component } from "@angular/core";
import { AuthService } from "../../service/auth.service";
import { Router } from "@angular/router";
import { Subject, debounceTime } from 'rxjs';


@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrl: "register.component.css",
  standalone: false
})
export class RegisterComponent {
  username: string = "";
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  errorMessage: string = "";

  isPassStrong: boolean = false;
  passwordsDoNotMatch: boolean = false;
  isFormValid: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isUsernameTaken: boolean = false;
  isCheckingUsername: boolean = false;
  isEmailValid: boolean = false;
  usernameChanged$ = new Subject<string>();


  constructor(private readonly authService: AuthService,
              private readonly router: Router) {
    sessionStorage.clear();
    this.usernameChanged$.pipe(
      debounceTime(400)
    ).subscribe(username => {
      this.checkUsername(this.username);
    });
  }


  private checkPasswordStrength(password: string): boolean {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return pattern.test(password);
  }

  private validateEmail(email: string): boolean {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  }

  validateForm() {
    this.isPassStrong = this.checkPasswordStrength(this.password);
    this.passwordsDoNotMatch = this.password !== this.confirmPassword;
    this.isEmailValid = this.validateEmail(this.email);

    this.isFormValid = !!this.username &&
      !!this.email &&
      this.isEmailValid &&
      !!this.password &&
      !!this.confirmPassword &&
      this.isPassStrong &&
      !this.passwordsDoNotMatch &&
      !this.isUsernameTaken;
  }

  onRegister() {
    if (!this.isFormValid) return;

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: value => {
        sessionStorage.setItem("token", value.token);
        this.router.navigate(["/registration-success"]).then(r => console.debug(r));
      },
      error: err => {
        this.errorMessage = "Помилка при реєстрації";
        console.error(err);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkUsername(username: string) {
    const trimmedUsername = this.username.trim();

    if (!trimmedUsername) {
      this.isUsernameTaken = false;
      this.validateForm();
      return;
    }

    this.isCheckingUsername = true;

    this.authService.checkUsername(trimmedUsername).subscribe({
      next: result => {
        this.isUsernameTaken = !!result.email;
        this.validateForm();
        this.isCheckingUsername = false;
      },
      error: err => {
        this.isUsernameTaken = err.status !== 404;
        this.validateForm();
        this.isCheckingUsername = false;
      }
    });
  }

  onUsernameChange(value: string) {
    this.usernameChanged$.next(value);
  }

}
