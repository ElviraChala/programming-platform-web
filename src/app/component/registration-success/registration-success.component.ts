import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: "app-registration-success",
  standalone: false,
  templateUrl: "./registration-success.component.html",
  styleUrl: "./registration-success.component.css"
})
export class RegistrationSuccessComponent {
  constructor(private router: Router) {
  }

  goToTest() {
    this.router.navigate(["/first-check"]);
  }
}
