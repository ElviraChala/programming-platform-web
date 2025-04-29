import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./component/main/main.component";
import { RegisterComponent } from "./component/register/register.component";
import { LoginComponent } from "./component/login/login.component";
import { CourseListComponent } from "./component/course-list/course-list.component";
import { RegistrationSuccessComponent } from "./component/registration-success/registration-success.component";
import { FirstCheckComponent } from "./component/first-check/first-check.component";
import { ProfileComponent } from "./component/profile/profile.component";

const routes: Routes = [
  {path: "", component: MainComponent},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "courses", component: CourseListComponent},
  {path: "registration-success", component: RegistrationSuccessComponent},  // Додано маршрут для успіху реєстрації
  {path: "first-check", component: FirstCheckComponent},
  {path: "profile", component: ProfileComponent},
  {path: "**", redirectTo: ""}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
