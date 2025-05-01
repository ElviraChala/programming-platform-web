import { Component, OnInit } from "@angular/core";
import { Student } from "../../interface/Student";
import { StudentService } from "../../service/student.service";
import { Router } from "@angular/router";
import { Course } from "../../interface/Course";
import { CourseService } from "../../service/course.service";

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

          if (this.student?.isFirst === true) {
            this.router.navigate(["/first-check"])
              .then(r => {
                console.debug(r);
              });
          }
        },
        error: value => console.error(value)
      });

    this.courseService.getAllCourses().subscribe({
      next: value => {
        this.courses = value;
        console.log("Отримані курси список:", this.courses);
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
}
