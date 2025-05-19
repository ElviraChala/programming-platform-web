import {Component} from "@angular/core";
import {Router} from "@angular/router";
import { StudentService } from "../../service/student.service";

@Component({
  selector: "app-registration-success",
  standalone: false,
  templateUrl: "./registration-success.component.html",
  styleUrl: "./registration-success.component.css"
})
export class RegistrationSuccessComponent {
  constructor(private readonly router: Router,
              private readonly studentService: StudentService) {
  }

  goToTest() {
    this.router.navigate(["/first-check"]).then(r => console.debug(r));
  }


  skipTest() {
    this.studentService.getStudent().subscribe({
      next: (student) => {
        if (student) {
          student.isFirst = false;
          this.studentService.updateStudent(student).subscribe({
            next: () => {
              this.router.navigate(["/courses"]).then(console.debug);
            },
            error: (error) => {
              console.error("Error updating student:", error);
            }
          });
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
