import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {FirstCheckService} from "../../service/FirstCheckService";
import {StudentService} from "../../service/StudentService";
import {Student} from "../../interface/Student";
import {FirstCheck} from "../../interface/FirstCheck";
import {AuthService} from "../../service/AuthService";

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
  savedAnswers: string[] = [];
  student: Student | undefined;

  constructor(
    private readonly firstCheckService: FirstCheckService,
    private readonly studentService: StudentService,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.studentService.getStudent().subscribe({
      next: (student) => {
        this.student = student;
        if (!student.isFirst) {
          this.router.navigate(['/courses']);
        } else {
          this.loadFirstCheck();
        }
      },
      error: (err) => {
        console.error('Error fetching student:', err);
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
          console.error('First check has no questions!');
        }
      },
      error: (error) => {
        console.error('Error loading first check:', error);
      },
      complete: () => {
      }
    });
  }

  getAnswer() {
    if (this.currentAnswer === "") {
      return;
    }

    this.savedAnswers[this.currentQuestionIndex] = this.currentAnswer;
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex === this.firstCheck?.questionIds.length) {
      this.submitAnswers();
      return;
    }

    this.currentQuestionId = this.firstCheck?.questionIds[this.currentQuestionIndex] ?? -1;
  }

  submitAnswers() {
    if (this.savedAnswers.length > 0) {
      this.firstCheckService.sendAnswers(this.savedAnswers).subscribe({
        next: (response) => {
          console.log("Answers submitted successfully:", response);
          if (this.student) {
            this.student.isFirst = false;
            this.studentService.updateStudent(this.student).subscribe({
              next: () => {
                console.log("Student status updated to not first");
                this.router.navigate(['/courses']);
              },
              error: (error) => {
                console.error("Error updating student status:", error);
              }
            });
          }
        },
        error: (error) => {
          console.error("Error submitting answers:", error);
        },
      });
    }
  }
}
