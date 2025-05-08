import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../service/auth.service";

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
  isForgotPassword: boolean = false;
  forgotPasswordEmail: string = "";
  forgotButtonText: string = "Забули пароль";

  forgotUsername: string = "";
  isUsernameChecked: boolean = false;
  forgotError: string = "";
  isUserNotFound: boolean = false;
  emailSentMessage: string = '';


  constructor(private readonly authService: AuthService,
              protected readonly router: Router) {
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

  forgotPassword() {
    this.isForgotPassword = !this.isForgotPassword;
    this.emailSentMessage = '';
    this.forgotError = "";

    if (this.isForgotPassword) {
      this.forgotButtonText = "Скасувати";
      this.resetForgotForm();
    } else {
      this.forgotButtonText = "Забули пароль";
      this.resetForgotForm();
    }
  }

  resetForgotForm() {
    this.isUsernameChecked = false;
    this.isUserNotFound = false;
    this.forgotUsername = "";
    this.forgotPasswordEmail = "";
    this.forgotError = "";
  }

  checkUsername() {
    if (!this.forgotUsername) {
      this.forgotError = "Введіть ім'я користувача.";
      return;
    }

    this.authService.checkUsername(this.forgotUsername).subscribe({
      next: (response) => {
        this.isUsernameChecked = true;
        this.isUserNotFound = false;
        this.forgotPasswordEmail = response.email;
        this.forgotError = "";
      },
      error: (err) => {
        if (err.status === 404) {
          this.isUserNotFound = true;
          this.isUsernameChecked = false;
          this.forgotError = "Користувача не знайдено.";
        } else if (err.status === 400) {
          this.isUsernameChecked = true;
          this.isUserNotFound = false;
          this.forgotPasswordEmail = "";
          this.forgotError = "";
        } else {
          this.forgotError = "Сталася помилка. Спробуйте ще раз.";
          this.isUsernameChecked = false;
          this.isUserNotFound = false;
        }
      }
    });
  }

  sendResetLink() {
    if (!this.forgotPasswordEmail) {
      this.forgotError = "Введіть email.";
      return;
    }

    this.authService.forgotPassword(this.forgotPasswordEmail).subscribe({
      next: () => {
        this.emailSentMessage = "Лист для відновлення паролю надіслано на вашу пошту.";
        this.forgotError = '';
        this.isForgotPassword = false;
        this.resetForgotForm();
        this.forgotButtonText = "Забули пароль";
      },
      error: (err) => {
        if (err.status === 403) {
          this.forgotError = "Email не підтверджено, недійсний або не відповідає користувачу.";
        } else if (err.status === 404) {
          this.forgotError = "Користувача з таким email не знайдено.";
        } else {
          this.forgotError = "Сталася помилка при надсиланні листа. Спробуйте ще раз.";
        }

        this.emailSentMessage = ""; // очищення повідомлення про успіх
      }
    });
  }

}
