import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Student } from "../../interface/Student";
import { StudentService } from "../../service/student.service";
import { Level } from "../../interface/Level";
import { Role } from "../../interface/Role";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-student-edit",
  templateUrl: "./student-edit.component.html",
  standalone: false,
  styleUrls: ["./student-edit.component.css"]
})
export class StudentEditComponent implements OnInit {
  studentId?: number;
  student?: Student;
  editForm?: FormGroup;
  levels = Object.values(Level);
  loading = true;
  error?: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly studentService: StudentService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get("id"));
    this.initForm();
    this.loadStudent();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      id: [{value: "", disabled: true}],
      username: ["", Validators.required],
      name: [""],
      email: ["", [Validators.email]],
      score: [0, [Validators.required, Validators.min(0)]],
      isFirst: [false],
      level: [Level.LOW, Validators.required],
      role: [{value: Role.STUDENT, disabled: true}]
    });
  }

  loadStudent(): void {
    this.loading = true;
    this.error = undefined;

    if (!this.studentId) {
      this.error = "Student ID not provided";
      this.loading = false;
      return;
    }

    this.studentService.getStudentById(this.studentId).subscribe({
      next: (student) => {
        if (student) {
          this.student = student;
          this.populateForm();
        } else {
          this.error = `Student with ID ${this.studentId} not found`;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = "Failed to load student data";
        console.error(err);
        this.loading = false;
      }
    });
  }

  populateForm(): void {
    let student = this.student;
    if (!student) {
      return;
    }
    this.editForm?.patchValue({
      id: student.id,
      username: student.username,
      name: student.name ?? "",
      email: student.email ?? "",
      score: student.score,
      isFirst: student.isFirst,
      level: student.level,
      role: student.role
    });
  }

  onSubmit(): void {
    if (this.editForm?.invalid) {
      return;
    }

    const updatedStudent: Student = {
      ...this.student,
      ...this.editForm?.getRawValue()
    };

    this.studentService.updateStudent(updatedStudent).subscribe({
      next: () => {
        console.log("Student updated successfully");
        this.router.navigate(["/users"]).then(console.debug);
      },
      error: (err) => {
        this.error = "Failed to update student";
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(["/users"]).then(console.debug);
  }
}
