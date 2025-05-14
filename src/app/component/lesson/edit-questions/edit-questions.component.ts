import { Component, OnInit } from "@angular/core";
import { Question } from "../../../interface/Question";
import { ActivatedRoute, Router } from "@angular/router";
import { CheckKnowledgeService } from "../../../service/check-knowladge.service";

@Component({
  selector: 'app-edit-questions',
  standalone: false,
  templateUrl: './edit-questions.component.html',
  styleUrl: './edit-questions.component.css'
})
export class EditQuestionsComponent implements OnInit{
  questions: Question[] = [];
  checkId!: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly checkService: CheckKnowledgeService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('checkKnowledgeId');
      if (id) {
        this.checkId = +id;
        this.loadQuestions();
      }
    });
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
