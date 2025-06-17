import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FirstCheckService } from "../../service/first-check.service";
import { StudentService } from "../../service/student.service";
import { Student } from "../../interface/Student";
import { FirstCheck } from "../../interface/FirstCheck";
import { Question } from "../../interface/Question";
import { Role } from "../../interface/Role";
import { QuestionService } from "../../service/question.service";

@Component({
  selector: "app-fires-check-edit",
  standalone: false,
  templateUrl: "./fires-check-edit.component.html",
  styleUrl: "./fires-check-edit.component.css"
})
export class FiresCheckEditComponent implements OnInit {
  firstCheck?: FirstCheck;
  questions: Question[] = [];
  student?: Student;
  isLogged: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private readonly firstCheckService: FirstCheckService,
    private readonly studentService: StudentService,
    private readonly questionService: QuestionService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn();

    this.studentService.getStudent().subscribe({
      next: (student) => {
        this.student = student;
        this.checkAdmin();
        this.loadFirstCheck();
      },
      error: (err) => {
        console.error("Error fetching student:", err);
      }
    });
  }

  isLoggedIn() {
    this.isLogged = !!sessionStorage.getItem("token");
  }

  checkAdmin() {
    this.isAdmin = this.student?.role === Role.ADMIN;
  }

  loadFirstCheck() {
    this.firstCheckService.getFirstCheck().subscribe({
      next: (value) => {
        this.firstCheck = value;
        if (this.firstCheck.questionIds && this.firstCheck.questionIds.length > 0) {
          this.loadQuestions();
        } else {
          console.error("First check has no questions!");
        }
      },
      error: (error) => {
        console.error("Error loading first check:", error);
      }
    });
  }

  loadQuestions() {
    if (!this.firstCheck || !this.firstCheck.questionIds) return;

    this.questions = [];

    // Load each question by ID
    this.firstCheck.questionIds.forEach(id => {
      this.questionService.getQuestionById(id).subscribe({
        next: (question) => {
          this.questions.push(question);
        },
        error: (err) => console.error(`Error loading question ${id}:`, err)
      });
    });
  }

  addQuestion(): void {
    this.router.navigate(["/add-question-form"], {
      queryParams: { isFirstCheck: true }
    }).then(console.debug);
  }

  editQuestion(q: Question): void {
    this.router.navigate(["/edit-question-form"], {
      queryParams: { questionId: q.id, isFirstCheck: true }
    }).then(console.debug);
  }

  deleteQuestion(id: number): void {
    this.questionService.deleteQuestion(id).subscribe({
      next: () => {
        // Remove the question ID from the firstCheck.questionIds array
        if (this.firstCheck && this.firstCheck.questionIds) {
          this.firstCheck.questionIds = this.firstCheck.questionIds.filter(qId => qId !== id);
          // Update the firstCheck object on the server
          this.firstCheckService.updateFirstCheck(this.firstCheck).subscribe({
            next: () => {
              console.log("First check updated successfully");
              this.loadQuestions(); // Reload the questions
            },
            error: (err) => console.error("Failed to update first check", err)
          });
        }
      },
      error: (err) => console.error("Failed to delete question", err)
    });
  }
}
