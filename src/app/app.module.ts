import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MainComponent } from "./component/main/main.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CourseListComponent } from "./component/course/course-list/course-list.component";
import { CourseComponent } from "./component/course/course-item/course.component";
import { QuestionComponent } from "./component/question/question.component";
import { FirstCheckComponent } from "./component/first-check/first-check.component";
import { AuthInterceptorService } from "./service/auth-interceptor.service";
import { RegisterComponent } from "./component/register/register.component";
import { LoginComponent } from "./component/login/login.component";
import { FooterComponent } from "./component/footer/footer.component";
import { NavbarComponent } from "./component/navbar/navbar.component";
import { RegistrationSuccessComponent } from "./component/registration-success/registration-success.component";
import { ProfileComponent } from "./component/profile/profile.component";
import { LessonListComponent } from './component/lesson/lesson-list/lesson-list.component';
import { LessonItemComponent } from './component/lesson/lesson-item/lesson-item.component';
import { LessonTestComponent } from './component/lesson/lesson-test/lesson-test.component';
import { CreateNewPasswordComponent } from './component/create-new-password/create-new-password.component';
import { CodingTaskComponent } from './component/coding-tasks/coding-tasks.component';
import { EditCourseComponent } from './component/course/edit-course/edit-course.component';
import { CourseCreateComponent } from './component/course/course-create/course-create.component';
import { EditQuestionsComponent } from './component/lesson/edit-questions/edit-questions.component';
import { EditQuestionFormComponent } from './component/lesson/edit-question-form/edit-question-form.component';
import { AddQuestionFormComponent } from './component/lesson/add-question-form/add-question-form.component';
import { LeaderboardComponent } from './component/leaderboard/leaderboard.component';
import { UsersEditComponent } from './component/users-edit/users-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    CourseListComponent,
    CourseComponent,
    QuestionComponent,
    FirstCheckComponent,
    RegisterComponent,
    LoginComponent,
    FooterComponent,
    NavbarComponent,
    RegistrationSuccessComponent,
    ProfileComponent,
    LessonListComponent,
    LessonItemComponent,
    LessonTestComponent,
    CreateNewPasswordComponent,
    CodingTaskComponent,
    EditCourseComponent,
    CourseCreateComponent,
    EditQuestionsComponent,
    EditQuestionFormComponent,
    AddQuestionFormComponent,
    LeaderboardComponent,
    UsersEditComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  exports: [
    QuestionComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
