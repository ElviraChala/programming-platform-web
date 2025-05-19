import { Component, OnInit } from "@angular/core";
import { Student } from "../../../interface/Student";
import { StudentService } from "../../../service/student.service";
import { Router } from "@angular/router";
import { Course } from "../../../interface/Course";
import { CourseService } from "../../../service/course.service";
import { Role } from "../../../interface/Role";

@Component({
  selector: "app-course-list",
  standalone: false,
  templateUrl: "./course-list.component.html",
  styleUrl: "./course-list.component.css"
})
export class CourseListComponent implements OnInit {

  isLogged: boolean = false;
  student?: Student;
  courses: Course[] = [];
  isAdmin: boolean = false;

  constructor(private readonly studentService: StudentService,
              private readonly courseService: CourseService,
              private readonly router: Router) {
  }

  ngOnInit(): void {
    this.isLoggedIn();
    this.studentService.getStudent()
      .subscribe({
        next: value => {
          this.student = value;

          if (this.student?.isFirst === true && this.student.role === Role.STUDENT) {
            this.router.navigate(["/first-check"]).then(console.debug);
          }
          this.checkAdmin();
        },
        error: value => console.error(value)
      });

    this.courseService.getAllCourses().subscribe({
      next: value => {
        this.courses = value;
      },
      error: value => console.error(value)
    });
  }

  isLoggedIn() {
    this.isLogged = !!sessionStorage.getItem("token");
  }

  openCourse(id: number): void {
    this.router.navigate(['/courses', id]).then(console.debug);
  }

  checkAdmin() {
    this.isAdmin = this.student?.role === Role.ADMIN;
  }

  createNewCourse(): void {
    this.router.navigate(['/courses/create']).then(console.debug);
  }

  editCourse(course: Course): void {
    this.router.navigate(['/courses', course.id, 'edit']).then(console.debug);
  }

  deleteCourse(courseId: number): void {
    if (confirm('Ви впевнені, що хочете видалити цей курс?')) {
      this.courseService.deleteCourse(courseId).subscribe({
        next: () => {
          this.courses = this.courses.filter(course => course.id !== courseId);
          console.log('Курс видалено');
        },
        error: err => {
          console.error('Помилка при видаленні курсу:', err);
        }
      });
    }
  }

}
