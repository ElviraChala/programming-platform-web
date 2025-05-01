import { Component, OnInit } from "@angular/core";
import { Student } from "../../interface/Student";
import { StudentService } from "../../service/student.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-profile",
  standalone: false,
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css"
})
export class ProfileComponent implements OnInit {
  student!: Student;
  username?: string;
  name?: string;
  email?: string;
  password: string = "";

  constructor(private readonly studentService: StudentService,
              private readonly router: Router) {
  }

  ngOnInit(): void {
    this.loadStudentData();
  }

  loadStudentData(): void {
    this.studentService.getStudent().subscribe({
      next: value => {
        if (!value) {
          this.router.navigate(["/login"]).then(console.debug);
          return;
        }

        this.student = value;
        this.username = value.username;
        this.email = value.email;
        this.name = value.name;
        this.password = "";
        this.student.password = "";
      },
      error: err => {
        console.error(err);
        this.router.navigate(["/login"]).then(console.debug);
      }
    });
  }

  onSubmit(): void {
    this.student.name = this.name;
    this.student.email = this.email;

    if (this.password.length > 0) {
      this.student.password = this.password;
    }

    this.studentService.updateStudent(this.student)
      .subscribe({
          next: student => {
            this.student = student;
            this.loadStudentData();
          },
          error: err => console.error(err)
        }
      );
  }
}
