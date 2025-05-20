import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Question } from "../../../interface/Question";
import { CheckKnowledgeService } from "../../../service/check-knowladge.service";
import { Student } from "../../../interface/Student";
import { StudentService } from "../../../service/student.service";
import { Answer } from "../../../interface/Answer";
import { CheckKnowledge } from "../../../interface/CheckKnowledge";
import { LessonService } from "../../../service/lesson.service";
import { Lesson } from "../../../interface/Lesson";


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
  total: number = 0;
  isCheckKnowledgeCompleted: boolean = false;
  isProgrammingTaskCompleted: boolean = false;
  nextLesson?: Lesson;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly checkKnowledgeService: CheckKnowledgeService,
    private readonly studentService: StudentService,
    private readonly lessonService: LessonService
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

  private findNextLesson(lessonId: number): void {
    this.lessonService.getLessonById(lessonId).subscribe({
      next: (currentLesson: Lesson) => {
        this.lessonService.getAllLessons().subscribe({
          next: (lessons: Lesson[]) => {
            // Filter lessons by course ID
            const courseLessons = lessons.filter(lesson => lesson.courseId === currentLesson.courseId);

            // Sort by orderIndex
            courseLessons.sort((a, b) => a.orderIndex - b.orderIndex);

            // Find current lesson index
            const currentIndex = courseLessons.findIndex(lesson => lesson.id === currentLesson.id);

            // Check if there's a next lesson
            if (currentIndex !== -1 && currentIndex < courseLessons.length - 1) {
              this.nextLesson = courseLessons[currentIndex + 1];
            }

            // For demonstration purposes, we'll set isProgrammingTaskCompleted to true
            // In a real implementation, we would check if the student has completed the programming task
            this.isProgrammingTaskCompleted = true;
          },
          error: (err) => {
            console.error("Помилка при завантаженні уроків", err);
          }
        });
      },
      error: (err) => {
        console.error("Помилка при завантаженні уроку", err);
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

          // Find the next lesson if there is a lessonId
          if (value.lessonId) {
            this.findNextLesson(value.lessonId);
          }
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

    this.isAnswers[this.currentQuestionIndex] = true;
    this.currentQuestionIndex++;

    if (!this.questions || this.currentQuestionIndex >= this.questions.length) {
      return;
    }

    this.currentQuestionId = this.questions[this.currentQuestionIndex].id;

    const saved = this.savedAnswers.find(ans => ans.id === this.currentQuestionId);
    this.currentAnswer = saved?.currentAnswer ?? "";
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

          // Check if the test is passed (score ratio >= 0.67)
          const isPassed = (result / this.check!.questions.length) >= 0.67;

          if (isPassed) {
            // Set isCheckKnowledgeCompleted to true when the test is passed
            this.isCheckKnowledgeCompleted = true;

            // Update student score
            this.studentService.addScore(this.student!.id, this.check!.id).subscribe({
              next: () => console.debug("Бали оновлено"),
              error: (err) => console.error("Помилка при оновленні балів:", err)
            });
          }
        },
        error: (error) => console.error("Error submitting answers:", error)
      });
  }

  goToNextLesson(): void {
    if (this.nextLesson) {
      this.router.navigate(['/lessons', this.nextLesson.id]).then(console.debug);
    }
  }

  goToCourseList(): void {
    this.router.navigate(['/courses']).then(console.debug);
  }

  getMessage(score:number): string {
    this.total = this.questions.length;
    const ratio = score / this.total;

    if (ratio === 1) {
      return "Чудова робота! Ти все знаєш 🥳";
    } else if (ratio >= 0.8) {
      return "Майже ідеально! Лише кілька дрібниць — і буде відмінно 👍";
    } else if (ratio >= 0.6) {
      return "Ти на правильному шляху! Повтори деякі теми — і все вийде 💪";
    } else if (ratio >= 0.4) {
      return "Ти вже дещо розумієш! Потрібно трохи більше практики 🔄";
    } else {
      return "Не зупиняйся! Ще одна спроба — і результат покращиться 🚀";
    }
  }


  goBackToLesson(): void {
    if (this.check?.lessonId) {
      this.router.navigate(["/lessons", this.check?.lessonId]).then(console.debug);
    } else {
      this.router.navigate(["/courses"]).then(console.debug);
    }
  }

  goToCodingTasks(): void {
    this.router.navigate(['/coding-tasks', this.check?.lessonId]).then(console.debug);
  }
}
