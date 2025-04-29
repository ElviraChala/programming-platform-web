import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FirstCheckService } from "../../service/FirstCheckService";
import { StudentService } from "../../service/StudentService";
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
    if (this.currentAnswer === "") {
      return;
    }

    this.savedAnswers.push({
      id: this.currentQuestionId,
      currentAnswer: this.currentAnswer
    });
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex === this.firstCheck?.questionIds.length) {
      this.submitAnswers();
      return;
    }

    this.currentQuestionId = this.firstCheck?.questionIds[this.currentQuestionIndex] ?? -1;
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
}
