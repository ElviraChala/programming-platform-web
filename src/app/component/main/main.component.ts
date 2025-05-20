import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {TokenObject} from "../../interface/TokenObject";

@Component({
  selector: "app-main",
  standalone: false,
  templateUrl: "./main.component.html",
  styleUrl: "./main.component.css"
})
export class MainComponent {
  username: string = "";
  password: string = "";

  constructor(private readonly authService: AuthService,
              private readonly router: Router) {
  }

  login() {
    let response = this.authService.login(this.username, this.password);
    console.log(response);
    response.subscribe({
      next: (res) => this.saveTokenAndMove(res),
      error: (err) => console.error("Login failed", err)
    });
  }

  private saveTokenAndMove(res: TokenObject) {
    console.debug("login success", res);

    sessionStorage.setItem("token", res.token);

    this.router.navigate(["/courses"]).then(r => {
      return console.debug(r);
    });
  }
}
