import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Lesson } from "../../../interface/Lesson";
import { LessonService } from "../../../service/lesson.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Role } from "../../../interface/Role";
import { StudentService } from "../../../service/student.service";
import { Student } from "../../../interface/Student";
import { TheoryService } from "../../../service/theory.service";

declare let hljs: any;

@Component({
  selector: "app-lesson-item",
  standalone: false,
  templateUrl: "./lesson-item.component.html",
  styleUrls: ["./lesson-item.component.css"]
})
export class LessonItemComponent implements OnInit, AfterViewInit {
  name: string = "";
  lesson?: Lesson;
  content: SafeHtml = "";
  student?: Student;
  isLogged: boolean = false;

  constructor(
    private readonly lessonService: LessonService,
    private readonly studentService: StudentService,
    private readonly theoryService: TheoryService,
    private readonly router: ActivatedRoute,
    private readonly route: Router,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.checkLogin();
    this.loadStudent();
    this.loadLesson();
  }

  ngAfterViewInit(): void {
    hljs.highlightAll();
  }

  private checkLogin(): void {
    this.isLogged = !!sessionStorage.getItem("token");
  }

  private loadStudent(): void {
    this.studentService.getStudent().subscribe({
      next: (value) => {
        this.student = value;
        console.log("Користувач:", this.student);
      },
      error: (err) => {
        console.error("Не вдалося завантажити студента", err);
      }
    });
  }

  private loadLesson(): void {
    const idParam = this.router.snapshot.paramMap.get("id");
    const id = idParam ? Number(idParam) : null;

    if (!id) {
      console.error("ID уроку не вказано або неправильне.");
      return;
    }

    this.lessonService.getLessonById(id).subscribe({
      next: (value) => {
        this.lesson = value;
        this.theoryService.getHtml(value.theory.id).subscribe({
          next: (html) => {
            this.content = this.sanitizer.bypassSecurityTrustHtml(html.content);
          },
          error: (err) => {
            console.error("Не вдалося завантажити теорію", err);
          }
        });
      },
      error: (err) => {
        console.error("Не вдалося завантажити урок", err);
      }
    });
  }

  isAdmin(): boolean {
    return this.student?.role === Role.ADMIN;
  }

  startLessonTest(): void {
    if (!this.lesson) return;
    this.route.navigate(["/lesson-test", this.lesson.checkKnowledgeId]).then(console.debug);
  }

  editQuestions(): void {
    if (!this.lesson?.checkKnowledgeId) return;
    this.route.navigate(["/edit-questions", this.lesson.checkKnowledgeId]).then(console.debug);
  }
}
