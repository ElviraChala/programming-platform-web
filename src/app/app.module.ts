import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MainComponent } from "./component/main/main.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CourseListComponent } from "./component/course-list/course-list.component";
import { CourseComponent } from "./component/course-item/course.component";
import { QuestionComponent } from "./component/question/question.component";
import { FirstCheckComponent } from "./component/first-check/first-check.component";
import { AuthInterceptorService } from "./service/auth-interceptor.service";
import { RegisterComponent } from "./component/register/register.component";
import { LoginComponent } from "./component/login/login.component";
import { FooterComponent } from "./component/footer/footer.component";
import { NavbarComponent } from "./component/navbar/navbar.component";
import { RegistrationSuccessComponent } from "./component/registration-success/registration-success.component";
import { ProfileComponent } from "./component/profile/profile.component";
import { LessonListComponent } from './component/lesson-list/lesson-list.component';
import { LessonItemComponent } from './component/lesson-item/lesson-item.component';
import { LessonTestComponent } from './component/lesson-test/lesson-test.component';
import { CreateNewPasswordComponent } from './component/create-new-password/create-new-password.component';

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
    CreateNewPasswordComponent
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
