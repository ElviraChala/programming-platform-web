import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Student} from "../../interface/Student";
import {StudentService} from "../../service/StudentService";

@Component({
  selector: "app-profile",
  standalone: false,
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css"
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  student!: Student;

  constructor(private readonly fb: FormBuilder,
              private readonly studentService: StudentService) {
  }

  ngOnInit(): void {
    this.loadStudentData();
  }

  loadStudentData(): void {
    this.studentService.getStudent().subscribe(data => {
      this.student = data;
      this.profileForm = this.fb.group({
        username: [this.student.username, [Validators.required]],
        name: [this.student.name, [Validators.required]],
        email: [this.student.email, [Validators.required, Validators.email]],
        password: ["", [Validators.minLength(6)]], // порожній для оновлення пароля при потребі
        level: [this.student.level],
        isFirst: [this.student.isFirst],
        score: [this.student.score]
      });
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {

      const updatedStudent: Student = {
        ...this.student,
        ...this.profileForm.value
      };

      this.studentService.updateStudent(updatedStudent)
        .subscribe({
          next: student => this.student = student,
          error: err => console.error(err)
        }
      );
    }
  }
}
