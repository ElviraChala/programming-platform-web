import { Component, OnInit } from "@angular/core";
import { Student } from "../../interface/Student";
import { StudentService } from "../../service/student.service";

@Component({
  selector: "app-users-edit",
  standalone: false,
  templateUrl: "./users-edit.component.html",
  styleUrl: "./users-edit.component.css"
})
export class UsersEditComponent implements OnInit{
  users: Student[] = [];

  constructor(private readonly studentService: StudentService) {}

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
    // Here you would typically open a modal or navigate to an edit page
    // For now, we'll just log the user to be edited
    console.log('Editing user:', user);

    // Example implementation:
    // You might want to implement a proper form or dialog for editing
    const updatedUser = { ...user };
    // After updating the user properties, call the service
    this.studentService.updateStudent(updatedUser).subscribe({
      next: () => {
        console.log('User updated successfully');
        this.loadUsers(); // Reload the users list
      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });
  }

  deleteUser(user: Student): void {
    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      this.studentService.deleteStudent(user.id).subscribe({
        next: () => {
          console.log('User deleted successfully');
          this.loadUsers(); // Reload the users list
        },
        error: (err) => {
          console.error('Error deleting user:', err);
        }
      });
    }
  }
}
