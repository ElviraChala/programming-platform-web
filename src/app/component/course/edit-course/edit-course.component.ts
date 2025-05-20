import { Component, OnInit } from "@angular/core";
import { Course } from "../../../interface/Course";
import { ActivatedRoute, Router } from "@angular/router";
import { CourseService } from "../../../service/course.service";
import { Level } from "../../../interface/Level";
import { Lesson } from "../../../interface/Lesson";
import { LessonService } from "../../../service/lesson.service";
import { ProgrammingTask } from "../../../interface/ProgrammingTask";
import { ProgrammingTaskService } from "../../../service/programming-task.service";
import { saveAs } from "file-saver";
import { CheckKnowledge } from "../../../interface/CheckKnowledge";
import { CheckKnowledgeService } from "../../../service/check-knowladge.service";

@Component({
  selector: "app-edit-course",
  standalone: false,
  templateUrl: "./edit-course.component.html",
  styleUrl: "./edit-course.component.css"
})
export class EditCourseComponent implements OnInit {
  course?: Course;
  levels?: string[] = Object.keys(Level).filter(key => isNaN(Number(key))); // ["LOW", "MEDIUM", "HIGH"]

  // Lesson management
  lessons: Lesson[] = [];
  newLesson: Lesson = this.createEmptyLesson();
  editingLesson: Lesson | null = null;
  isAddingLesson = false;
  isEditingLesson = false;

  // HTML file management
  selectedFile: File | null = null;
  selectedEditFile: File | null = null;

  // Programming Task management
  programmingTasks: ProgrammingTask[] = [];
  newProgrammingTask: ProgrammingTask = this.createEmptyProgrammingTask(0);
  editingProgrammingTask: ProgrammingTask | null = null;
  isAddingProgrammingTask = false;
  isEditingProgrammingTask = false;
  selectedLessonForTask: Lesson | null = null;

  // CheckKnowledge management
  currentCheckKnowledge: CheckKnowledge | null = null;

  constructor(private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly courseService: CourseService,
              private readonly lessonService: LessonService,
              private readonly programmingTaskService: ProgrammingTaskService,
              private readonly checkKnowledgeService: CheckKnowledgeService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.courseService.getCourseById(id).subscribe({
      next: data => {
        this.course = data;
        this.loadLessons();
      },
      error: err => console.error("Не вдалося завантажити курс:", err)
    });
  }

  updateCourse(): void {
    if (!this.course) return;

    this.courseService.updateCourse(this.course).subscribe({
      next: () => {
        alert("Курс оновлено!");
        this.router.navigate(["/courses"]).then(console.debug);
      },
      error: err => console.error("Помилка при оновленні:", err)
    });
  }

  goBack(): void {
    this.router.navigate(["/courses"]).then(console.debug);
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
    this.selectedFile = null;
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0];
      // Set the fileName to match the uploaded file if it's not already set
      if (!this.newLesson.theory.fileName) {
        this.newLesson.theory.fileName = this.selectedFile.name;
      }
    }
  }

  saveNewLesson(): void {
    if (!this.course?.id) {
      alert("Спочатку збережіть курс");
      return;
    }

    this.newLesson.courseId = this.course.id;

    // First, create the lesson
    this.lessonService.createLesson(this.newLesson).subscribe({
      next: (createdLesson) => {
        this.lessons.push(createdLesson);

        // Update the course's lessonIds array
        if (!this.course!.lessonIds) {
          this.course!.lessonIds = [];
        }
        this.course!.lessonIds.push(createdLesson.id);

        // If there's a file selected, upload it
        if (this.selectedFile) {
          this.lessonService.uploadHtmlFile(this.selectedFile, createdLesson.theory.fileName).subscribe({
            next: (savedFileName) => {
              console.log("HTML файл завантажено:", savedFileName);
            },
            error: (err) => {
              console.error("Помилка при завантаженні HTML файлу:", err);
              alert("Урок створено, але не вдалося завантажити HTML файл");
            }
          });
        }

        // Update the course to save the new lessonIds
        this.courseService.updateCourse(this.course!).subscribe({
          next: () => {
            alert("Урок додано!");
            this.isAddingLesson = false;
            this.newLesson = this.createEmptyLesson();
            this.selectedFile = null;
          },
          error: (err) => console.error("Помилка при оновленні курсу:", err)
        });
      },
      error: (err) => console.error("Помилка при створенні уроку:", err)
    });
  }

  startEditLesson(lesson: Lesson): void {
    this.isEditingLesson = true;
    this.isAddingLesson = false;
    this.editingLesson = {...lesson}; // Create a copy to avoid direct modification

    // Load the associated CheckKnowledge object if it exists
    if (lesson.checkKnowledgeId && lesson.checkKnowledgeId > 0) {
      this.checkKnowledgeService.getById(lesson.checkKnowledgeId).subscribe({
        next: (checkKnowledge) => {
          this.currentCheckKnowledge = checkKnowledge;
        },
        error: (err) => {
          console.error(`Не вдалося завантажити тест знань з ID ${lesson.checkKnowledgeId}:`, err);
          this.currentCheckKnowledge = null;
        }
      });
    } else {
      this.currentCheckKnowledge = null;
    }
  }

  cancelEditLesson(): void {
    this.isEditingLesson = false;
    this.editingLesson = null;
    this.selectedEditFile = null;
    this.currentCheckKnowledge = null;
  }

  onEditFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0 && this.editingLesson) {
      this.selectedEditFile = element.files[0];
      // Set the fileName to match the uploaded file if it's not already set
      if (!this.editingLesson.theory.fileName) {
        this.editingLesson.theory.fileName = this.selectedEditFile.name;
      }
    }
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

        // If there's a file selected, upload it
        if (this.selectedEditFile) {
          this.lessonService.uploadHtmlFile(this.selectedEditFile, updatedLesson.theory.fileName).subscribe({
            next: () => {
              console.log("HTML файл завантажено:", updatedLesson.theory.fileName);
            },
            error: (err) => {
              console.error("Помилка при завантаженні HTML файлу:", err);
              alert("Урок оновлено, але не вдалося завантажити HTML файл");
            }
          });
        }

        // If there's a CheckKnowledge object, save it
        if (this.currentCheckKnowledge) {
          this.saveCheckKnowledge();
        }

        alert("Урок оновлено!");
        this.isEditingLesson = false;
        this.editingLesson = null;
        this.selectedEditFile = null;
        this.currentCheckKnowledge = null;
      },
      error: (err) => console.error("Помилка при оновленні уроку:", err)
    });
  }

  saveCheckKnowledge(): void {
    if (!this.currentCheckKnowledge) return;

    this.checkKnowledgeService.update(this.currentCheckKnowledge).subscribe({
      next: (updatedCheck) => {
        console.log("Тест знань оновлено:", updatedCheck);
      },
      error: (err) => {
        console.error("Помилка при оновленні тесту знань:", err);
        alert("Урок оновлено, але не вдалося оновити тест знань");
      }
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
            next: () => alert("Урок видалено!"),
            error: (err) => console.error("Помилка при оновленні курсу:", err)
          });
        }
      },
      error: (err) => console.error("Помилка при видаленні уроку:", err)
    });
  }

  downloadHtmlFile(fileName: string): void {
    if (!fileName) {
      alert("Назва файлу не вказана");
      return;
    }

    this.lessonService.downloadHtmlFile(fileName).subscribe({
      next: (blob) => {
        saveAs(blob, fileName);
      },
      error: (err) => {
        console.error("Помилка при завантаженні файлу:", err);
        alert("Не вдалося завантажити файл");
      }
    });
  }

  private createEmptyLesson(): Lesson {
    return {
      id: -1,
      name: "",
      orderIndex: 0,
      courseId: 0,
      theory: {
        id: -1,
        fileName: "",
        lessonId: 0
      },
      checkKnowledgeId: -1,
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
      alert("Спочатку виберіть урок");
      return;
    }

    this.programmingTaskService.createProgrammingTask(this.newProgrammingTask).subscribe({
      next: (createdTask) => {
        this.programmingTasks.push(createdTask);

        // Update the lesson's programmingTaskIds array
        if (!this.selectedLessonForTask!.programmingTaskIds) {
          this.selectedLessonForTask!.programmingTaskIds = [];
        }
        this.selectedLessonForTask!.programmingTaskIds.push(createdTask.id);
      },
      error: (err) => console.error("Помилка при створенні завдання:", err)
    });
  }

  startEditProgrammingTask(task: ProgrammingTask, lesson: Lesson): void {
    this.selectedLessonForTask = lesson;
    this.isEditingProgrammingTask = true;
    this.isAddingProgrammingTask = false;
    this.editingProgrammingTask = {...task}; // Create a copy to avoid direct modification
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

        alert("Завдання оновлено!");
        this.isEditingProgrammingTask = false;
        this.selectedLessonForTask = null;
        this.editingProgrammingTask = null;
      },
      error: (err) => console.error("Помилка при оновленні завдання:", err)
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
      error: (err) => console.error("Помилка при видаленні завдання:", err)
    });
  }

  private createEmptyProgrammingTask(id: number): ProgrammingTask {
    return {
      id: 0,
      title: "",
      description: "",
      starterCode: "",
      expectedOutput: "",
      lessonId: id,
      testWeight: 1
    };
  }
}
