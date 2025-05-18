import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Student } from "../../interface/Student";
import { StudentService } from "../../service/student.service";

@Component({
  selector: "app-users-edit",
  standalone: false,
  templateUrl: "./users-edit.component.html",
  styleUrl: "./users-edit.component.css"
})
export class UsersEditComponent implements OnInit {
  users: Student[] = [];

  constructor(
    private readonly studentService: StudentService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.studentService.getAllStudents().subscribe({
      next: (value) => {
        this.users = value;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  editUser(user: Student): void {
    // Navigate to the student-edit component with the user's ID
    this.router.navigate(["/students", user.id, "edit"]).then(console.debug);
  }

  deleteUser(user: Student): void {
    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      this.studentService.deleteStudent(user.id).subscribe({
        next: () => {
          console.log("User deleted successfully");
          this.loadUsers(); // Reload the users list
        },
        error: (err) => {
          console.error("Error deleting user:", err);
        }
      });
    }
  }
}
