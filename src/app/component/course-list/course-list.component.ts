import {Component, OnInit} from "@angular/core";
import {Student} from "../../interface/Student";
import {StudentService} from "../../service/StudentService";
import {Router} from "@angular/router";

@Component({
  selector: "app-course-list",
  standalone: false,
  templateUrl: "./course-list.component.html",
  styleUrl: "./course-list.component.css"
})
export class CourseListComponent implements OnInit {

  student?: Student;

  constructor(private readonly studentService: StudentService,
              private readonly router: Router) {
  }

  ngOnInit(): void {
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
  }
}
