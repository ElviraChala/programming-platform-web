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

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    CourseListComponent,
    CourseItemComponent,
    QuestionComponent,
    FirstCheckComponent
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
