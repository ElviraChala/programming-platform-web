import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./component/main/main.component";
import { RegisterComponent } from "./component/register/register.component";
import { LoginComponent } from "./component/login/login.component";
import { CourseListComponent } from "./component/course-list/course-list.component";
import { RegistrationSuccessComponent } from "./component/registration-success/registration-success.component";
import { FirstCheckComponent } from "./component/first-check/first-check.component";
import { ProfileComponent } from "./component/profile/profile.component";
import { CourseComponent } from "./component/course-item/course.component";
import { LessonItemComponent } from "./component/lesson-item/lesson-item.component";
import { LessonListComponent } from "./component/lesson-list/lesson-list.component";
import { LessonTestComponent } from "./component/lesson-test/lesson-test.component";
import { CreateNewPasswordComponent } from "./component/create-new-password/create-new-password.component";

const routes: Routes = [
  {path: "", component: MainComponent},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "courses", component: CourseListComponent},
  {path: "registration-success", component: RegistrationSuccessComponent},
  {path: "lessons/:id", component: LessonItemComponent},
  {path: "lessons", component: LessonListComponent},
  {path: "lesson-test/:checkKnowledgeId", component: LessonTestComponent},
  {path: "first-check", component: FirstCheckComponent},
  {path: "profile", component: ProfileComponent},
  {path: "courses/:id", component: CourseComponent},
  {path: "courses", component: CourseListComponent},
  {path: "auth/create-new-password", component: CreateNewPasswordComponent},
  {path: "**", redirectTo: ""}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
