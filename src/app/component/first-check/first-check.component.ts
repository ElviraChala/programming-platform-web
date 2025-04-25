import {Component, OnInit} from "@angular/core";
import {FirstCheck} from "../../interface/FirstCheck";
import {FirstCheckService} from "../../service/FirstCheckService";

@Component({
  selector: "app-first-check",
  standalone: false,
  templateUrl: "./first-check.component.html",
  styleUrl: "./first-check.component.css"
})
export class FirstCheckComponent implements OnInit {

  firstCheck?: FirstCheck;
  currentQuestionId: number = -1;
  currentQuestionIndex: number = -1;
  currentAnswer: string = "";
  savedAnsvers: string[] = [];

  constructor(private readonly firstCheckService: FirstCheckService) {
  }

  ngOnInit(): void {
    this.firstCheckService.getFirstCheck().subscribe({
      next: value => {
        console.debug("First-check", value);
        this.firstCheck = value;

        this.currentQuestionIndex = 0;
        this.currentQuestionId = this.firstCheck.questionIds[this.currentQuestionIndex];
      },
      error: value => {
        console.error(value);
      }
    });
  }

  getAnswer() {
    this.savedAnsvers[this.currentQuestionIndex] = this.currentAnswer;
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex === this.firstCheck?.questionIds.length) {
      alert("Done");
      return;
    }

    this.currentQuestionId = this.firstCheck?.questionIds[this.currentQuestionIndex] || -1;
  }
}
