import { Component, Input, OnInit } from "@angular/core";
import { Course } from "../../interface/Course";
import { CourseService } from "../../service/course.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-course-item",
  standalone: false,
  templateUrl: "./course-item.component.html",
  styleUrl: "./course-item.component.css"
})
export class CourseItemComponent implements OnInit {
  @Input() id!: number;

  isLogged: boolean = false;
  name: string = "";
  course?: Course;

  constructor(private readonly courseService: CourseService,
              private readonly router: Router) {}

  ngOnInit(): void {
    this.isLogged = !!sessionStorage.getItem("token");

    if (!this.id) {
      return;
    }

    this.courseService.getCourseById(this.id).subscribe({
      next: value => {
        this.course = value;
        this.name = value.name;
      },
      error: value => console.error(value)
    });
  }

  // TODO треба доробити перехід до курсів
  openCourse() {
    this.router.navigate(["/courses", this.course?.name
      .toLowerCase()
      .replace(" ", "-")
    ]).then(console.debug);
  }
}
