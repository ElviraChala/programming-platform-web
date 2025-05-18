import { Component, OnInit } from "@angular/core";
import { Course } from "../../../interface/Course";
import { ActivatedRoute, Router } from "@angular/router";
import { CourseService } from "../../../service/course.service";
import { Level } from "../../../interface/Level";
import { Lesson } from "../../../interface/Lesson";
import { LessonService } from "../../../service/lesson.service";

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

  constructor(private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly courseService: CourseService,
              private readonly lessonService: LessonService) {}

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
}
