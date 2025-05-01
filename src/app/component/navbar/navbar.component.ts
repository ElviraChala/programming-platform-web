import { AfterViewInit, Component } from "@angular/core";
import { StudentService } from "../../service/StudentService";


@Component({
  selector: "app-navbar",
  standalone: false,
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css"
})
export class NavbarComponent implements AfterViewInit {
  username?: string;
  isLogged: boolean = false;

  constructor(private readonly studentService: StudentService) {
  }

  ngAfterViewInit(): void {
    this.isLoggedIn();
    this.getUserName();
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
