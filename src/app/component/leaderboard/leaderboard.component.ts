import { Component, OnInit } from "@angular/core";
import { Student } from "../../interface/Student";
import { StudentService } from "../../service/student.service";

@Component({
  selector: 'app-leaderboard',
  standalone: false,
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit{
  students: Student[] = [];

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.getLeaderboard().subscribe(data => {
      this.students = data;
    });
  }
}
