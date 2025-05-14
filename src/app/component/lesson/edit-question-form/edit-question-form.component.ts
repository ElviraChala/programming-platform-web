import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Level } from "../../../interface/Level";
import { Question } from "../../../interface/Question";
import { QuestionService } from "../../../service/question.service";

@Component({
  selector: 'app-edit-question-form',
  standalone: false,
  templateUrl: './edit-question-form.component.html',
  styleUrls: ['./edit-question-form.component.css']
})
export class EditQuestionFormComponent implements OnInit {
  form: any = {
    text: '',
    options: [''],
    correctAnswer: '',
    level: '',
  };
  questionId!: number;
  checkKnowledgeId!: number;
  levels: Level[] = [Level.LOW, Level.MEDIUM, Level.HIGH];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly questionService: QuestionService,
  ) {}

  ngOnInit(): void {
    // Отримуємо параметр 'questionId' з URL
    this.route.queryParams.subscribe(params => {
      this.questionId = params['questionId'];
      if (this.questionId) {
        this.loadQuestion(); // Якщо є id питання, завантажуємо його
      }
    });
  }

  loadQuestion(): void {
    this.questionService.getQuestionById(this.questionId).subscribe({
      next: (question: Question) => {
        this.form = {
          text: question.text,
          options: question.options,
          correctAnswer: question.correctAnswer,
          level: question.level,
        };
        this.checkKnowledgeId = question.checkKnowledgeId ?? 0;
        console.log("id question", this.checkKnowledgeId);
      },
      error: (err) => console.error('Помилка завантаження питання', err)
    });
  }

  save(): void {
    if (!this.form.text || !this.form.correctAnswer || !this.form.level) {
      return;
    }

    const updatedQuestion: Question = {
      id: this.questionId,
      text: this.form.text,
      options: this.form.options,
      correctAnswer: this.form.correctAnswer,
      level: this.form.level,
      checkKnowledgeId: this.checkKnowledgeId
    };

    this.questionService.updateQuestion(updatedQuestion).subscribe({
      next: () => this.router.navigate(['/edit-questions', this.checkKnowledgeId]),
      error: err => console.error('Не вдалося оновити питання', err)
    });
  }

  addOption(): void {
    this.form.options.push('');
  }

  removeOption(index: number): void {
    this.form.options.splice(index, 1);
  }
}
