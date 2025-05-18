import { Component, HostListener, OnInit } from "@angular/core";
import { StudentService } from "../../service/student.service";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { Role } from "../../interface/Role";

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
  isAdmin: boolean = false;

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
  onResize() {
    if (window.innerWidth > 768) {
      this.menuOpen = false;
    }
  }

  isLoggedIn() {
    this.isLogged = !!sessionStorage.getItem("token") && this.username !== "";
  }

  getUserName() {
    this.studentService.getStudent().subscribe({
      next: value => {
        this.username = value.username;
        this.isAdmin = value.role === Role.ADMIN;
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
