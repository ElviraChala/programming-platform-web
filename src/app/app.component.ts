import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  standalone: false,
  styleUrl: "./app.component.css"
})
export class AppComponent {
  title = "programming-platform-web";

  constructor() {
    localStorage.clear();
  }
}

export const backHost = "http://dev-spark.fun:8080";
