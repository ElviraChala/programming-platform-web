import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./component/main/main.component";
import { RegisterComponent } from "./component/register/register.component";
import { LoginComponent } from "./component/login/login.component";
import { CourseListComponent } from "./component/course/course-list/course-list.component";
import { RegistrationSuccessComponent } from "./component/registration-success/registration-success.component";
import { FirstCheckComponent } from "./component/first-check/first-check.component";
import { ProfileComponent } from "./component/profile/profile.component";
import { CourseComponent } from "./component/course/course-item/course.component";
import { LessonItemComponent } from "./component/lesson/lesson-item/lesson-item.component";
import { LessonListComponent } from "./component/lesson/lesson-list/lesson-list.component";
import { LessonTestComponent } from "./component/lesson/lesson-test/lesson-test.component";
import { CreateNewPasswordComponent } from "./component/create-new-password/create-new-password.component";
import { CodingTaskComponent } from "./component/coding-tasks/coding-tasks.component";
import { EditCourseComponent } from "./component/course/edit-course/edit-course.component";
import { CourseCreateComponent } from "./component/course/course-create/course-create.component";
import { EditQuestionsComponent } from "./component/lesson/edit-questions/edit-questions.component";
import { AddQuestionFormComponent } from "./component/lesson/add-question-form/add-question-form.component";
import { EditQuestionFormComponent } from "./component/lesson/edit-question-form/edit-question-form.component";
import { LeaderboardComponent } from "./component/leaderboard/leaderboard.component";
import { UsersEditComponent } from "./component/users-edit/users-edit.component";
import { StudentEditComponent } from "./component/student-edit/student-edit.component";
import { VerifyEmailComponent } from "./component/verify-email/verify-email.component";

const routes: Routes = [
  {path: "", component: MainComponent},

  // 🔐 Аутентифікація
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "registration-success", component: RegistrationSuccessComponent},
  {path: "auth/create-new-password", component: CreateNewPasswordComponent},
  {path: "auth/verify-email", component: VerifyEmailComponent},
  {path: "leaderboard", component: LeaderboardComponent},

  // 👤 Користувач
  {path: "profile", component: ProfileComponent},
  {path: "first-check", component: FirstCheckComponent},

  // 📚 Курси
  {path: "courses/create", component: CourseCreateComponent},         // має йти першим
  {path: "courses/:id/edit", component: EditCourseComponent},         // далі спеціфічні
  {path: "courses/:id", component: CourseComponent},                  // потім загальний з параметром
  {path: "courses", component: CourseListComponent},                  // в самому кінці курси без параметрів

  // 📘 Уроки
  {path: "lessons/:id", component: LessonItemComponent},
  {path: "lessons", component: LessonListComponent},
  {path: "add-question-form", component: AddQuestionFormComponent},
  {path: "edit-question-form", component: EditQuestionFormComponent},

  // 🧪 Тести та завдання
  {path: "lesson-test/:checkKnowledgeId", component: LessonTestComponent},
  {path: "edit-questions/:checkKnowledgeId", component: EditQuestionsComponent},
  {path: "coding-tasks/:id", component: CodingTaskComponent},

  {path: "users", component: UsersEditComponent},
  {path: "students/:id/edit", component: StudentEditComponent},

  // 🔁 Фолбек
  {path: "**", redirectTo: ""}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
