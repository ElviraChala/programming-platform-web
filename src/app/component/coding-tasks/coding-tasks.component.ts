import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LessonService } from '../../service/lesson.service';
import { ProgrammingTaskService } from '../../service/programming-task.service';
import { Lesson } from '../../interface/Lesson';
import { ProgrammingTask } from '../../interface/ProgrammingTask';

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
    private readonly lessonService: LessonService,
    private readonly programmingTaskService: ProgrammingTaskService
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
    const normalizedExpected = this.task.expectedOutput.trim();

    if (normalizedCode.includes(normalizedExpected)) {
      this.output = this.task.expectedOutput;
    } else {
      this.output = 'Результат не збігається з очікуваним';
    }
  }
}
