import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Level } from "../../../interface/Level";
import { Question } from "../../../interface/Question";
import { QuestionService } from "../../../service/question.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-add-question-form",
  standalone: false,
  templateUrl: "./add-question-form.component.html",
  styleUrl: "./add-question-form.component.css"
})
export class AddQuestionFormComponent implements OnInit {
  form: any = {
    text: "",
    options: [""],
    correctAnswer: "",
    level: ""
  };
  checkKnowledgeId!: number;
  levels: Level[] = [Level.LOW, Level.MEDIUM, Level.HIGH];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly questionService: QuestionService,
    private readonly location: Location
  ) {}

  ngOnInit(): void {
    // Отримуємо параметр 'checkKnowledgeId' з URL
    this.route.queryParams.subscribe(params => {
      this.checkKnowledgeId = params["checkId"];
      if (!this.checkKnowledgeId) {
        console.error("checkKnowledgeId не вказано");
        this.location.back();
      }
    });
  }

  save(): void {
    if (!this.form.text || !this.form.correctAnswer || !this.form.level) {
      return;
    }

    const newQuestion: Question = {
      id: 0, // ID буде присвоєно на сервері
      text: this.form.text,
      options: this.form.options.filter((option: string) => option.trim() !== ""),
      correctAnswer: this.form.correctAnswer,
      level: this.form.level,
      checkKnowledgeId: this.checkKnowledgeId
    };

    this.questionService.createQuestion(newQuestion).subscribe({
      next: () => {
        this.router.navigate(["/edit-questions", this.checkKnowledgeId]).then(console.debug);
      },
      error: err => console.error("Не вдалося створити питання", err)
    });
  }

  addOption(): void {
    this.form.options.push("");
  }

  removeOption(index: number): void {
    this.form.options.splice(index, 1);
    if (this.form.options.length === 0) {
      this.addOption(); // Завжди має бути хоча б один варіант відповіді
    }
  }

  cancel(): void {
    this.location.back();
  }

  updateOption($event: FocusEvent, i: number): void {
    let element = $event.target as HTMLInputElement;
    this.form.options[i] = element.value;
  }
}
