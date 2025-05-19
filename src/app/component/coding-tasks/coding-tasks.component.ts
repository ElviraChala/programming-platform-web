import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from '../../service/lesson.service';
import { ProgrammingTaskService } from '../../service/programming-task.service';
import { Lesson } from '../../interface/Lesson';
import { ProgrammingTask } from '../../interface/ProgrammingTask';
import { InterpreterService } from "../../service/interpreter.service";

@Component({
  selector: 'app-coding-tasks',
  standalone: false,
  templateUrl: './coding-tasks.component.html',
  styleUrls: ['./coding-tasks.component.css'],
})
export class CodingTaskComponent implements OnInit {
  task: ProgrammingTask | null = null;
  code: string = '';
  output: string = '';
  taskLoaded: boolean = false;
  lesson?: Lesson;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly lessonService: LessonService,
    private readonly programmingTaskService: ProgrammingTaskService,
    private readonly interpreterService: InterpreterService
  ) {}

  ngOnInit(): void {
    const lessonIdParam = this.route.snapshot.paramMap.get('id');
    const lessonId = lessonIdParam ? Number(lessonIdParam) : null;

    if (!lessonId) {
      console.error('Невірний ID уроку');
      return;
    }

    this.lessonService.getLessonById(lessonId).subscribe({
      next: (lesson: Lesson) => {
        this.lesson = lesson;

        if (lesson.programmingTaskIds && lesson.programmingTaskIds.length > 0) {
          const taskId = lesson.programmingTaskIds[0];
          this.loadProgrammingTask(taskId);
        } else {
          console.warn('Урок не містить програмувальних завдань');
          this.taskLoaded = true;
        }
      },
      error: (err) => {
        console.error('Помилка при завантаженні уроку', err);
      }
    });
  }

  private loadProgrammingTask(taskId: number): void {
    this.programmingTaskService.getProgrammingTaskById(taskId).subscribe({
      next: (task: ProgrammingTask) => {
        this.task = task;
        this.code = task.starterCode || '';
        this.taskLoaded = true;
      },
      error: (err) => {
        console.error('Помилка при завантаженні завдання', err);
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
        } else {
          this.output = "Щось не так:"
            + "\nОчікуваний результат: " + value.expectedOutput
            + "\nПоточний результат: " + value.actualOutput
        }
      },
      error: err => {
        console.error(err);
        this.output = "Виникла помилка";
      }
    })
  }

  goBackToLesson(): void {
    if (this.lesson?.id) {
      this.router.navigate(['/lessons', this.lesson.id]).then(console.debug);
    } else {
      this.router.navigate(['/courses']).then(console.debug);
    }
  }

  goToLessonTest(): void {
    if (this.lesson?.checkKnowledgeId) {
      this.router.navigate(['/lesson-test', this.lesson.checkKnowledgeId]).then(console.debug);
    }
  }

  goToCourseList(): void {
    this.router.navigate(['/courses']).then(console.debug);
  }
}
