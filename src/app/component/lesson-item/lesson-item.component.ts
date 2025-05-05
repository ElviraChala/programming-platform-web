import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Lesson } from "../../interface/Lesson";
import { LessonService } from "../../service/lesson.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

declare let hljs: any;

@Component({
  selector: "app-lesson-item",
  standalone: false,
  templateUrl: "./lesson-item.component.html",
  styleUrls: ["./lesson-item.component.css"],

})
export class LessonItemComponent implements OnInit, AfterViewInit {
  name: string = "";
  lesson?: Lesson;
  content: SafeHtml = "";

  constructor(private readonly lessonService: LessonService,
              private readonly router: ActivatedRoute,
              private readonly route: Router,
              private readonly sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const idParam = this.router.snapshot.paramMap.get("id");
    const id = idParam ? Number(idParam) : null;

    if (!id) {
      console.error("ID уроку не вказано або неправильне.");
      return;
    }

    this.lessonService.getLessonById(id).subscribe({
        next: (value) => {
          this.lesson = value;
          this.content = this.sanitizer.bypassSecurityTrustHtml(value.theory.fileName);
        },
        error: (err) => {
          console.error("Не вдалося завантажити урок", err);
        }
      }
    );
  }

  startLessonTest() {
    if (!this.lesson) return;
    this.route.navigate(['/lesson-test', this.lesson.checkKnowledgeId]).then(console.debug);
  }

  ngAfterViewInit(): void {
    hljs.highlightAll();
  }

}
