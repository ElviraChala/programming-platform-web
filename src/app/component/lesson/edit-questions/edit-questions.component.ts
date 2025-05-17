import { Component, OnInit } from "@angular/core";
import { Question } from "../../../interface/Question";
import { ActivatedRoute, Router } from "@angular/router";
import { CheckKnowledgeService } from "../../../service/check-knowladge.service";
import { Role } from "../../../interface/Role";
import { Student } from "../../../interface/Student";
import { StudentService } from "../../../service/student.service";

@Component({
  selector: 'app-edit-questions',
  standalone: false,
  templateUrl: './edit-questions.component.html',
  styleUrl: './edit-questions.component.css'
})
export class EditQuestionsComponent implements OnInit{
  isLogged: boolean = false;
  student?: Student;
  questions: Question[] = [];
  checkId!: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly studentService: StudentService,
    private readonly checkService: CheckKnowledgeService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn();

    this.studentService.getStudent()
      .subscribe({
        next: value => {
          this.student = value;

          if (this.student?.isFirst === true) {
            this.router.navigate(["/first-check"])
              .then(r => {
                console.debug(r);
              });
          }
        },
        error: value => console.error(value)
      });

    this.route.paramMap.subscribe(params => {
      const id = params.get('checkKnowledgeId');
      if (id) {
        this.checkId = +id;
        this.loadQuestions();
      }
    });
  }

  isLoggedIn() {
    this.isLogged = !!sessionStorage.getItem("token");
  }

  isAdmin(): boolean {
    console.log("isAdmin", this.student?.role === Role.ADMIN, this.student?.role);
    return this.student?.role === Role.ADMIN;
  }

  loadQuestions(): void {
    this.checkService.getQuestions(this.checkId).subscribe({
      next: (qs) => this.questions = qs,
      error: (err) => console.error('Помилка завантаження питань', err)
    });
  }

  addQuestion(): void {
    this.router.navigate(['/add-question-form'], { queryParams: { checkId: this.checkId } }).then(console.debug);
  }

  editQuestion(q: Question): void {
    this.router.navigate(['/edit-question-form'], { queryParams: { questionId: q.id } }).then(console.debug);
  }

  deleteQuestion(id: number): void {
    this.checkService.delete(id).subscribe({
      next: () => this.loadQuestions(),
      error: (err) => console.error('Не вдалося видалити питання', err)
    });
  }
}
