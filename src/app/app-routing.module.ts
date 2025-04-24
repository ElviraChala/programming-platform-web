import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from './component/main/main.component';
import {CourseListComponent} from "./component/course-list/course-list.component";
import {FirstCheckComponent} from "./component/first-check/first-check.component";

const routes: Routes = [
  {
    path: "", component: MainComponent
  }, {
    path: "courses", component: CourseListComponent
  }, {
    path: "first-check", component: FirstCheckComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
