import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {MainComponent} from "./component/main/main.component";
import {FormsModule} from "@angular/forms";
import {CourseListComponent} from "./component/course-list/course-list.component";
import {CourseItemComponent} from "./component/course-item/course-item.component";
import {QuestionComponent} from "./component/question/question.component";
import {FirstCheckComponent} from "./component/first-check/first-check.component";
import {AuthInterceptor} from "./service/AuthInterceptor";
import {RegisterComponent} from "./component/register/register.component";
import {LoginComponent} from "./component/login/login.component";
import { FooterComponent } from './component/footer/footer.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { RegistrationSuccessComponent } from './component/registration-success/registration-success.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    CourseListComponent,
    CourseItemComponent,
    QuestionComponent,
    FirstCheckComponent,
    RegisterComponent,
    LoginComponent,
    FooterComponent,
    NavbarComponent,
    RegistrationSuccessComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
