import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../service/auth.service";

@Component({
  selector: "app-create-new-password",
  templateUrl: "./create-new-password.component.html",
  styleUrls: ["./create-new-password.component.css"],
  standalone: false
})
export class CreateNewPasswordComponent implements OnInit {
  form!: FormGroup;
  email!: string;
  token!: string;
  submitted = false;
  errorMessage = "";
  successMessage = "";
  newPassword: string = "";

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get("email") ?? "";
    this.token = this.route.snapshot.queryParamMap.get("token") ?? "";

    this.form = this.fb.group({
      newPassword: ["", [Validators.required, Validators.minLength(6)]]
    });

    if (this.token != null && this.token != "") {
      sessionStorage.setItem("token", this.token);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    this.authService.update(this.email, this.newPassword)
      .subscribe({
        next: () => {
          this.successMessage = "Пароль успішно змінено";
          setTimeout(() => this.router.navigate(["/login"]), 2000);
        },
        error: err => {
          this.errorMessage = err;
        }
      });
  }
}
