import { Component, OnInit } from "@angular/core";
import { Course } from "../../../interface/Course";
import { ActivatedRoute, Router } from "@angular/router";
import { CourseService } from "../../../service/course.service";
import { Level } from "../../../interface/Level";

@Component({
  selector: 'app-edit-course',
  standalone: false,
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.css'
})
export class EditCourseComponent implements OnInit{
  course?: Course;
  levels?: string[] = Object.keys(Level).filter(key => isNaN(Number(key))); // ["LOW", "MEDIUM", "HIGH"]

  constructor(private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly courseService: CourseService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.courseService.getCourseById(id).subscribe({
      next: data => this.course = data,
      error: err => console.error('Не вдалося завантажити курс:', err)
    });
  }

  updateCourse(): void {
    if (!this.course) return;

    this.courseService.updateCourse(this.course).subscribe({
      next: () => {
        alert('Курс оновлено!');
        this.router.navigate(['/courses']).then(console.debug);
      },
      error: err => console.error('Помилка при оновленні:', err)
    });
  }

  goBack(): void {
    this.router.navigate(['/courses']).then(console.debug);
  }
}
