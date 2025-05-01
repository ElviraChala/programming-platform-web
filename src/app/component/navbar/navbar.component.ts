import { Component, OnInit } from "@angular/core";
import { StudentService } from "../../service/student.service";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";


@Component({
  selector: "app-navbar",
  standalone: false,
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css"
})
export class NavbarComponent implements OnInit {
  username?: string;
  isLogged: boolean = false;

  constructor(private readonly studentService: StudentService,
              private readonly router: Router) {
  }

  ngOnInit(): void {
    this.isLoggedIn();
    this.getUserName();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isLoggedIn();
        this.getUserName();
      });
  }

  isLoggedIn() {
    this.isLogged = !!sessionStorage.getItem("token");
  }

  getUserName() {
    this.studentService.getStudent().subscribe({
      next: value => {
        this.username = value.username;
      }
    });
  }

  logout() {
    sessionStorage.clear();
    window.location.href = "/login"; // або router.navigate()
  }
}
