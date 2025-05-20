import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../service/auth.service";

@Component({
  selector: "app-verify-email",
  standalone: false,
  templateUrl: "./verify-email.component.html",
  styleUrl: "./verify-email.component.css"
})
export class VerifyEmailComponent implements OnInit {
  token: string | null = null;
  verificationStatus: 'pending' | 'success' | 'error' = 'pending';
  errorMessage: string = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  verifyEmail(): void {
    if (!this.token) {
      this.verificationStatus = 'error';
      this.errorMessage = 'Токен верифікації відсутній';
      return;
    }

    this.authService.verifyEmail(this.token).subscribe({
      next: () => {
        this.verificationStatus = 'success';
      },
      error: (error) => {
        this.verificationStatus = 'error';
        this.errorMessage = 'Помилка верифікації email. Будь ласка, спробуйте знову або зверніться до підтримки.';
        console.error('Email verification error:', error);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']).then(console.debug);
  }
}
