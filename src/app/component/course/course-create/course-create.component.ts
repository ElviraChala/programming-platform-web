import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Level } from "../../../interface/Level";
import { CourseService } from "../../../service/course.service";
import { Router } from "@angular/router";
import { Course } from "../../../interface/Course";

@Component({
  selector: 'app-course-create',
  standalone: false,
  templateUrl: './course-create.component.html',
  styleUrl: './course-create.component.css'
})
export class CourseCreateComponent implements OnInit{
  courseForm!: FormGroup;
  levels = Object.values(Level);

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
       this.courseForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      level: [this.levels[0], Validators.required]
    });
  }

  get name() {
    return this.courseForm.get('name')!;
  }

  get description() {
    return this.courseForm.get('description')!;
  }

  createCourse(): void {
    if (this.courseForm.valid) {
      const newCourse: Omit<Course, 'id'> = this.courseForm.value;

      this.courseService.createCourse({
        ...newCourse,
        studentIds: [],
        lessonIds: []
      }).subscribe({
        next: () => this.router.navigate(['/courses']),
        error: err => console.error('Помилка при створенні курсу:', err)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/courses']).then(console.debug);
  }
}
