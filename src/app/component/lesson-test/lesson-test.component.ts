import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Question } from "../../interface/Question";
import { CheckKnowledgeService } from "../../service/check-knowladge.service";
import { Student } from "../../interface/Student";
import { StudentService } from "../../service/student.service";
import { Lesson } from "../../interface/Lesson";
import { Answer } from "../../interface/Answer";
import { CheckKnowledge } from "../../interface/CheckKnowledge";


@Component({
  selector: "app-lesson-test",
  templateUrl: "./lesson-test.component.html",
  styleUrls: ["./lesson-test.component.css"],
  standalone: false
})
export class LessonTestComponent implements OnInit {
  check?: CheckKnowledge;
  currentQuestionIndex: number = -1;
  currentQuestionId: number = -1;
  currentAnswer: string = "";
  isAnswers: boolean[] = [];
  savedAnswers: Answer[] = [];
  showResults: boolean = false;
  resultScore: number = 0;
  feedbackMessage: string = "";
  student?: Student;
  questions: Question[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly checkKnowledgeService: CheckKnowledgeService,
    private readonly studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const checkId = params.get("checkKnowledgeId");
      if (checkId) {
        this.initStudentAndQuestions(checkId);
      } else {
        console.error("checkKnowledgeId не передано у маршрут!");
        this.router.navigate(["/courses"]).then(console.debug);
      }
    });
  }

  private initStudentAndQuestions(checkId: string): void {
    this.checkKnowledgeService.getById(Number(checkId))
      .subscribe({
        next: (value) => {
          this.check = value;
          this.questions = value.questions;
          this.goToQuestion(0);
        },
        error: console.error
      });

    this.studentService.getStudent().subscribe({
      next: (student) => {
        this.student = student;
        if (!student) {
          this.router.navigate(["/courses"]).then(console.debug);
        }
      },
      error: (err) => console.error("Error fetching student:", err)
    });
  }

  getAnswer(): void {
    this.saveCurrentAnswer();

    this.currentQuestionIndex++;

    if (!this.questions || this.currentQuestionIndex >= this.questions.length) {
      return;
    }

    this.currentQuestionId = this.questions[this.currentQuestionIndex].id;

    const saved = this.savedAnswers.find(ans => ans.id === this.currentQuestionId);
    this.currentAnswer = saved?.currentAnswer ?? "";

    this.isAnswers[this.currentQuestionIndex] = true;
  }

  saveCurrentAnswer(): void {
    const trimmedAnswer = this.currentAnswer.trim();
    if (!trimmedAnswer) return;

    const existingIndex = this.savedAnswers.findIndex(ans => ans.id === this.currentQuestionId);
    if (existingIndex !== -1) {
      this.savedAnswers[existingIndex].currentAnswer = trimmedAnswer;
    } else {
      this.savedAnswers.push({
        id: this.currentQuestionId,
        currentAnswer: trimmedAnswer
      });
    }
  }

  goToQuestion(index: number): void {
    this.saveCurrentAnswer();

    this.currentQuestionIndex = index;
    this.currentQuestionId = this.questions[index].id;
    const saved = this.savedAnswers.find(ans => ans.id === this.currentQuestionId);
    this.currentAnswer = saved?.currentAnswer ?? "";
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.goToQuestion(this.currentQuestionIndex + 1);
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.goToQuestion(this.currentQuestionIndex - 1);
    }
  }

  submitAnswers(): void {
    this.saveCurrentAnswer();

    if (this.savedAnswers.length <= 0 || !this.check?.id) return;

    this.checkKnowledgeService.submitAnswers(this.check.id, this.savedAnswers)
      .subscribe({
        next: result => {
          this.resultScore = result;
          this.feedbackMessage = this.getMessage(result);
          this.showResults = true;
        },
        error: (error) => console.error("Error submitting answers:", error)
      });
  }

  getMessage(score: number): string {
    if (score === 100) return "Чудова робота! Ти все знаєш 🥳";
    if (score >= 80) return "Майже ідеально! Лише кілька дрібниць — і буде відмінно 👍";
    if (score >= 60) return "Ти на правильному шляху! Повтори деякі теми — і все вийде 💪";
    return "Не зупиняйся! Ще одна спроба — і результат покращиться 🚀";
  }

  goBackToLesson(): void {
    if (this.check?.lessonId) {
      this.router.navigate(["/courses", this.check?.lessonId]).then(console.debug);
    } else {
      this.router.navigate(["/courses"]).then(console.debug);
    }
  }
}
