import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LessonService } from "../../service/lesson.service";
import { ProgrammingTaskService } from "../../service/programming-task.service";
import { Lesson } from "../../interface/Lesson";
import { ProgrammingTask } from "../../interface/ProgrammingTask";
import { InterpreterService } from "../../service/interpreter.service";
import { StudentService } from "../../service/student.service";
import { Student } from "../../interface/Student";

@Component({
  selector: "app-coding-tasks",
  standalone: false,
  templateUrl: "./coding-tasks.component.html",
  styleUrls: ["./coding-tasks.component.css"]
})
export class CodingTaskComponent implements OnInit {
  task: ProgrammingTask | null = null;
  code: string = "";
  output: string = "";
  taskLoaded: boolean = false;
  lesson?: Lesson;
  student?: Student;
  isTaskCompleted: boolean = false;
  isCheckKnowledgeCompleted: boolean = false;
  nextLesson?: Lesson;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly lessonService: LessonService,
    private readonly programmingTaskService: ProgrammingTaskService,
    private readonly interpreterService: InterpreterService,
    private readonly studentService: StudentService
  ) {}

  ngOnInit(): void {
    const lessonIdParam = this.route.snapshot.paramMap.get("id");
    const lessonId = lessonIdParam ? Number(lessonIdParam) : null;

    if (!lessonId) {
      console.error("Невірний ID уроку");
      return;
    }

    // Load student
    this.studentService.getStudent().subscribe({
      next: (student) => {
        this.student = student;
      },
      error: (err) => {
        console.error("Помилка при завантаженні студента", err);
      }
    });

    this.lessonService.getLessonById(lessonId).subscribe({
      next: (lesson: Lesson) => {
        this.lesson = lesson;

        // Find next lesson
        this.findNextLesson(lesson);

        // Check if knowledge test is completed
        this.checkKnowledgeCompletion(lesson);

        if (lesson.programmingTaskIds && lesson.programmingTaskIds.length > 0) {
          const taskId = lesson.programmingTaskIds[0];
          this.loadProgrammingTask(taskId);
        } else {
          console.warn("Урок не містить програмувальних завдань");
          this.taskLoaded = true;
        }
      },
      error: (err) => {
        console.error("Помилка при завантаженні уроку", err);
      }
    });
  }

  private findNextLesson(currentLesson: Lesson): void {
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
      },
      error: (err) => {
        console.error("Помилка при завантаженні уроків", err);
      }
    });
  }

  private checkKnowledgeCompletion(lesson: Lesson): void {
    // We consider the knowledge test completed if the student has a score for it
    // This is determined in the LessonTestComponent when submitAnswers is called
    // and the score ratio is >= 0.67
    // For now, we'll just set it to false and update it when the task is completed
    this.isCheckKnowledgeCompleted = false;
  }

  private loadProgrammingTask(taskId: number): void {
    this.programmingTaskService.getProgrammingTaskById(taskId).subscribe({
      next: (task: ProgrammingTask) => {
        this.task = task;
        this.code = task.starterCode || "";
        this.taskLoaded = true;
      },
      error: (err) => {
        console.error("Помилка при завантаженні завдання", err);
      }
    });
  }

  runCode(): void {
    if (!this.task) return;

    const normalizedCode = this.code.trim();
    this.interpreterService.checkCode(this.task.id, normalizedCode).subscribe({
      next: value => {
        if (value.isOk) {
          this.output = "Супер, все правильно";
          this.isTaskCompleted = true;
          this.checkBothTasksCompleted();
        } else {
          this.output = "Щось не так:"
            + "\nОчікуваний результат: " + value.expectedOutput
            + "\nПоточний результат: " + value.actualOutput;
        }
      },
      error: err => {
        console.error(err);
        this.output = "Виникла помилка";
      }
    });
  }

  private checkBothTasksCompleted(): void {
    // For now, we'll consider the knowledge test completed if the student has a score for it
    // This is determined in the LessonTestComponent when submitAnswers is called
    // and the score ratio is >= 0.67

    // For demonstration purposes, we'll check if the programming task is completed
    if (this.isTaskCompleted) {
      // In a real implementation, we would check if the student has a score for the knowledge test
      // For now, we'll just set isCheckKnowledgeCompleted to true for demonstration
      this.isCheckKnowledgeCompleted = true;
    }
  }

  goToNextLesson(): void {
    if (this.nextLesson) {
      this.router.navigate(["/lessons", this.nextLesson.id]).then(console.debug);
    }
  }

  goBackToLesson(): void {
    if (this.lesson?.id) {
      this.router.navigate(["/lessons", this.lesson.id]).then(console.debug);
    } else {
      this.router.navigate(["/courses"]).then(console.debug);
    }
  }

  goToLessonTest(): void {
    if (this.lesson?.checkKnowledgeId) {
      this.router.navigate(["/lesson-test", this.lesson.checkKnowledgeId]).then(console.debug);
    }
  }

  goToCourseList(): void {
    this.router.navigate(["/courses"]).then(console.debug);
  }
}
