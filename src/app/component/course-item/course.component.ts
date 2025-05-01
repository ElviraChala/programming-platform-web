import { Component, Input, OnInit } from "@angular/core";
import { Course } from "../../interface/Course";
import { CourseService } from "../../service/course.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Lesson } from "../../interface/Lesson";
import { LessonService } from "../../service/lesson.service";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-course-item",
  standalone: false,
  templateUrl: "./course.component.html",
  styleUrl: "./course.component.css"
})
export class CourseComponent implements OnInit {
  @Input() id!: number;

  isLogged: boolean = false;
  name: string = "";
  course?: Course;
  lessons: Lesson[] = [];

  constructor(private readonly courseService: CourseService,
              private readonly lessonService: LessonService,
              private readonly router: ActivatedRoute,
              private readonly route: Router) {}

  ngOnInit(): void {
    this.isLogged = !!sessionStorage.getItem("token");

    const idParam = this.router.snapshot.paramMap.get("id");
    const id = idParam ? Number(idParam) : null;

    if (!id) {
      console.error("ID курсу не вказано або неправильне.");
      return;
    }

    this.courseService.getCourseById(id).subscribe({
      next: (value) => {
        this.course = value;
        console.log("Отриманий курс:", this.course);

        if (this.course.lessonIds && this.course.lessonIds.length > 0) {
          // Отримати всі уроки паралельно
          const lessonObservables = this.course.lessonIds.map(id =>
            this.lessonService.getLessonById(id)
          );

          forkJoin(lessonObservables).subscribe({
            next: (lessons) => {
              this.lessons = lessons;
              console.log("Отримані уроки:", this.lessons);
            },
            error: (err) => {
              console.error("Помилка під час завантаження уроків:", err);
            }
          });
        }

      },
      error: (err) => {
        console.error("Не вдалося завантажити курс:", err);
      }
    });
  }

  openLesson(lessonId: number): void {
    this.route.navigate(["/lessons", lessonId]).then(console.debug);
  }
}
