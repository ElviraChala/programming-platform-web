import { Component, OnInit, HostListener } from "@angular/core";
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
  menuOpen = false;

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

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth > 768) {
      this.menuOpen = false;
    }
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

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout() {
    sessionStorage.clear();
    this.closeMenu();
    window.location.href = "/login";
  }
}
