import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FirstCheckService } from "../../service/first-check.service";
import { StudentService } from "../../service/student.service";
import { Student } from "../../interface/Student";
import { FirstCheck } from "../../interface/FirstCheck";
import { Answer } from "../../interface/Answer";
import { Level } from "../../interface/Level";

@Component({
  selector: "app-first-check",
  standalone: false,
  templateUrl: "./first-check.component.html",
  styleUrl: "./first-check.component.css"
})
export class FirstCheckComponent implements OnInit {
  firstCheck?: FirstCheck;
  currentQuestionId: number = -1;
  currentQuestionIndex: number = -1;
  currentAnswer: string = "";
  savedAnswers: Answer[] = [];
  student: Student | undefined;
  showResults: boolean = false;
  resultScore?: number;
  resultLevel?: Level;
  feedbackMessage: string = "";
  isAnswers: boolean[] = [];

  constructor(
    private readonly firstCheckService: FirstCheckService,
    private readonly studentService: StudentService,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.studentService.getStudent().subscribe({
      next: (student) => {
        this.student = student;
        if (!student.isFirst) {
          this.router.navigate(["/courses"]).then(r => console.debug(r));
        } else {
          this.loadFirstCheck();
        }
      },
      error: (err) => {
        console.error("Error fetching student:", err);
      }
    });
  }

  loadFirstCheck() {
    this.firstCheckService.getFirstCheck().subscribe({
      next: (value) => {
        console.debug("First-check", value);
        this.firstCheck = value;
        if (this.firstCheck.questionIds && this.firstCheck.questionIds.length > 0) {
          this.currentQuestionIndex = 0;
          this.currentQuestionId = this.firstCheck.questionIds[0];
        } else {
          console.error("First check has no questions!");
        }
      },
      error: (error) => {
        console.error("Error loading first check:", error);
      },
      complete: () => {
      }
    });
  }

  getAnswer() {
    this.saveCurrentAnswer();

    if (this.currentQuestionIndex + 1 >= (this.firstCheck?.questionIds.length ?? 0)) {
      this.currentQuestionIndex++;
      return;
    }

    this.isAnswers[this.currentQuestionIndex] = true;
    this.currentQuestionIndex++;
    this.currentQuestionId = this.firstCheck?.questionIds[this.currentQuestionIndex] ?? -1;

    const nextSaved = this.savedAnswers.find(ans => ans.id === this.currentQuestionId);
    this.currentAnswer = nextSaved?.currentAnswer ?? "";
  }

  // navigation for questions

  saveCurrentAnswer() {
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

  isAnswered(index: number) {
    const questionId = this.firstCheck?.questionIds[index];
    this.isAnswers[index] = this.savedAnswers.some(ans => ans.id === questionId && ans.currentAnswer.trim() !== "");
  }

  goToQuestion(index: number): void {
    if (!this.firstCheck) return;

    this.saveCurrentAnswer();

    const newQuestionId = this.firstCheck.questionIds[index];
    const saved = this.savedAnswers.find(ans => ans.id === newQuestionId);

    this.currentAnswer = saved?.currentAnswer ?? "";
    this.currentQuestionIndex = index;
    this.currentQuestionId = newQuestionId;
  }


  submitAnswers() {
    if (this.savedAnswers.length <= 0) {
      return;
    }

    this.firstCheckService.sendAnswers(this.savedAnswers).subscribe({
      next: (response) => {
        console.log("Answers submitted successfully:", response);
        this.resultScore = response.score;
        this.resultLevel = response.level;
        this.setFeedbackMessage(this.resultScore);
        this.showResults = true;
      },
      error: (error) => {
        console.error("Error submitting answers:", error);
      }
    });
  }

  goToCourses() {
    this.router.navigate(["/courses"]).then(console.debug);
  }

  setFeedbackMessage(score: number): void {
    if (score < 40) {
      this.feedbackMessage = "Не засмучуйтесь! Це лише початок — все ще попереду 💪";
    } else if (score < 75) {
      this.feedbackMessage = "Чудово! У вас вже є базові знання, продовжуйте в тому ж дусі 👏";
    } else {
      this.feedbackMessage = "Вражаюче! Ви чудово підготовлені 🎉🚀";
    }
  }
}
