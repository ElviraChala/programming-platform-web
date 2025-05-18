import { Component, OnInit } from "@angular/core";
import { Course } from "../../../interface/Course";
import { ActivatedRoute, Router } from "@angular/router";
import { CourseService } from "../../../service/course.service";
import { Level } from "../../../interface/Level";
import { Lesson } from "../../../interface/Lesson";
import { LessonService } from "../../../service/lesson.service";
import { ProgrammingTask } from "../../../interface/ProgrammingTask";
import { ProgrammingTaskService } from "../../../service/programming-task.service";

@Component({
  selector: 'app-edit-course',
  standalone: false,
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.css'
})
export class EditCourseComponent implements OnInit{
  course?: Course;
  levels?: string[] = Object.keys(Level).filter(key => isNaN(Number(key))); // ["LOW", "MEDIUM", "HIGH"]

  // Lesson management
  lessons: Lesson[] = [];
  newLesson: Lesson = this.createEmptyLesson();
  editingLesson: Lesson | null = null;
  isAddingLesson = false;
  isEditingLesson = false;

  // Programming Task management
  programmingTasks: ProgrammingTask[] = [];
  newProgrammingTask: ProgrammingTask = this.createEmptyProgrammingTask(0);
  editingProgrammingTask: ProgrammingTask | null = null;
  isAddingProgrammingTask = false;
  isEditingProgrammingTask = false;
  selectedLessonForTask: Lesson | null = null;

  constructor(private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly courseService: CourseService,
              private readonly lessonService: LessonService,
              private readonly programmingTaskService: ProgrammingTaskService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.courseService.getCourseById(id).subscribe({
      next: data => {
        this.course = data;
        this.loadLessons();
      },
      error: err => console.error('Не вдалося завантажити курс:', err)
    });
  }

  updateCourse(): void {
    if (!this.course) return;

    this.courseService.updateCourse(this.course).subscribe({
      next: () => {
        alert('Курс оновлено!');
        this.router.navigate(['/courses']).then(console.debug);
      },
      error: err => console.error('Помилка при оновленні:', err)
    });
  }

  goBack(): void {
    this.router.navigate(['/courses']).then(console.debug);
  }

  // Lesson management methods
  loadLessons(): void {
    if (this.course?.lessonIds?.length === 0) {
      this.lessons = [];
      return;
    }

    // Load each lesson by ID
    this.lessons = [];
    if (!this.course) {
      return;
    }
    for (const lessonId of this.course.lessonIds) {
      this.lessonService.getLessonById(lessonId).subscribe({
        next: (lesson) => this.lessons.push(lesson),
        error: (err) => console.error(`Не вдалося завантажити урок з ID ${lessonId}:`, err)
      });
    }
  }

  startAddLesson(): void {
    this.isAddingLesson = true;
    this.isEditingLesson = false;
    this.newLesson = this.createEmptyLesson();
    if (this.course) {
      this.newLesson.courseId = this.course.id ?? 0;
      this.newLesson.orderIndex = this.lessons.length;
    }
  }

  cancelAddLesson(): void {
    this.isAddingLesson = false;
    this.newLesson = this.createEmptyLesson();
  }

  saveNewLesson(): void {
    if (!this.course?.id) {
      alert('Спочатку збережіть курс');
      return;
    }

    this.newLesson.courseId = this.course.id;

    this.lessonService.createLesson(this.newLesson).subscribe({
      next: (createdLesson) => {
        this.lessons.push(createdLesson);

        // Update the course's lessonIds array
        if (!this.course!.lessonIds) {
          this.course!.lessonIds = [];
        }
        this.course!.lessonIds.push(createdLesson.id);

        // Update the course to save the new lessonIds
        this.courseService.updateCourse(this.course!).subscribe({
          next: () => {
            alert('Урок додано!');
            this.isAddingLesson = false;
            this.newLesson = this.createEmptyLesson();
          },
          error: (err) => console.error('Помилка при оновленні курсу:', err)
        });
      },
      error: (err) => console.error('Помилка при створенні уроку:', err)
    });
  }

  startEditLesson(lesson: Lesson): void {
    this.isEditingLesson = true;
    this.isAddingLesson = false;
    this.editingLesson = { ...lesson }; // Create a copy to avoid direct modification
  }

  cancelEditLesson(): void {
    this.isEditingLesson = false;
    this.editingLesson = null;
  }

  saveEditedLesson(): void {
    if (!this.editingLesson) return;

    this.lessonService.updateLesson(this.editingLesson).subscribe({
      next: (updatedLesson) => {
        // Update the lesson in the local array
        const index = this.lessons.findIndex(l => l.id === updatedLesson.id);
        if (index !== -1) {
          this.lessons[index] = updatedLesson;
        }

        alert('Урок оновлено!');
        this.isEditingLesson = false;
        this.editingLesson = null;
      },
      error: (err) => console.error('Помилка при оновленні уроку:', err)
    });
  }

  deleteLesson(lesson: Lesson): void {
    if (!confirm(`Ви впевнені, що хочете видалити урок "${lesson.name}"?`)) {
      return;
    }

    this.lessonService.deleteLesson(lesson.id).subscribe({
      next: () => {
        // Remove the lesson from the local array
        this.lessons = this.lessons.filter(l => l.id !== lesson.id);

        // Update the course's lessonIds array
        if (this.course?.lessonIds) {
          this.course.lessonIds = this.course.lessonIds.filter(id => id !== lesson.id);

          // Update the course to save the new lessonIds
          this.courseService.updateCourse(this.course).subscribe({
            next: () => alert('Урок видалено!'),
            error: (err) => console.error('Помилка при оновленні курсу:', err)
          });
        }
      },
      error: (err) => console.error('Помилка при видаленні уроку:', err)
    });
  }

  private createEmptyLesson(): Lesson {
    return {
      id: 0,
      name: '',
      orderIndex: 0,
      courseId: 0,
      theory: {
        id: 0,
        fileName: '',
        lessonId: ''
      },
      checkKnowledgeId: 0,
      programmingTaskIds: []
    };
  }

  // Programming Task management methods
  loadProgrammingTasks(lesson: Lesson): void {
    if (!lesson.programmingTaskIds || lesson.programmingTaskIds.length === 0) {
      this.programmingTasks = [];
      return;
    }

    // Load each programming task by ID
    this.programmingTasks = [];
    for (const taskId of lesson.programmingTaskIds) {
      this.programmingTaskService.getProgrammingTaskById(taskId).subscribe({
        next: (task) => this.programmingTasks.push(task),
        error: (err) => console.error(`Не вдалося завантажити завдання з ID ${taskId}:`, err)
      });
    }
  }

  startAddProgrammingTask(lesson: Lesson): void {
    this.selectedLessonForTask = lesson;
    this.isAddingProgrammingTask = true;
    this.isEditingProgrammingTask = false;
    this.newProgrammingTask = this.createEmptyProgrammingTask(lesson.id);
    this.loadProgrammingTasks(lesson);
  }

  cancelAddProgrammingTask(): void {
    this.isAddingProgrammingTask = false;
    this.selectedLessonForTask = null;
    this.newProgrammingTask = this.createEmptyProgrammingTask(0);
  }

  saveNewProgrammingTask(): void {
    if (!this.selectedLessonForTask) {
      alert('Спочатку виберіть урок');
      return;
    }

    console.log(this.newProgrammingTask);

    this.programmingTaskService.createProgrammingTask(this.newProgrammingTask).subscribe({
      next: (createdTask) => {
        this.programmingTasks.push(createdTask);

        // Update the lesson's programmingTaskIds array
        if (!this.selectedLessonForTask!.programmingTaskIds) {
          this.selectedLessonForTask!.programmingTaskIds = [];
        }
        this.selectedLessonForTask!.programmingTaskIds.push(createdTask.id);
      },
      error: (err) => console.error('Помилка при створенні завдання:', err)
    });
  }

  startEditProgrammingTask(task: ProgrammingTask, lesson: Lesson): void {
    this.selectedLessonForTask = lesson;
    this.isEditingProgrammingTask = true;
    this.isAddingProgrammingTask = false;
    this.editingProgrammingTask = { ...task }; // Create a copy to avoid direct modification
    this.loadProgrammingTasks(lesson);
  }

  cancelEditProgrammingTask(): void {
    this.isEditingProgrammingTask = false;
    this.selectedLessonForTask = null;
    this.editingProgrammingTask = null;
  }

  saveEditedProgrammingTask(): void {
    if (!this.editingProgrammingTask) return;

    this.programmingTaskService.updateProgrammingTask(this.editingProgrammingTask).subscribe({
      next: (updatedTask) => {
        // Update the task in the local array
        const index = this.programmingTasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          this.programmingTasks[index] = updatedTask;
        }

        alert('Завдання оновлено!');
        this.isEditingProgrammingTask = false;
        this.selectedLessonForTask = null;
        this.editingProgrammingTask = null;
      },
      error: (err) => console.error('Помилка при оновленні завдання:', err)
    });
  }

  deleteProgrammingTask(task: ProgrammingTask, lesson: Lesson): void {
    if (!confirm(`Ви впевнені, що хочете видалити завдання "${task.title}"?`)) {
      return;
    }

    this.programmingTaskService.deleteProgrammingTask(task.id).subscribe({
      next: () => {
        // Remove the task from the local array
        this.programmingTasks = this.programmingTasks.filter(t => t.id !== task.id);

        // Update the lesson's programmingTaskIds array
        if (lesson.programmingTaskIds) {
          lesson.programmingTaskIds = lesson.programmingTaskIds.filter(id => id !== task.id);
        }
      },
      error: (err) => console.error('Помилка при видаленні завдання:', err)
    });
  }

  private createEmptyProgrammingTask(id: number): ProgrammingTask {
    return {
      id: 0,
      title: '',
      description: '',
      starterCode: '',
      expectedOutput: '',
      lessonId: id,
    };
  }
}
