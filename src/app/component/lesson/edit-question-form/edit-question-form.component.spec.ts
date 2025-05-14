import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQuestionFormComponent } from './edit-question-form.component';

describe('EditQuestionFormComponent', () => {
  let component: EditQuestionFormComponent;
  let fixture: ComponentFixture<EditQuestionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditQuestionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditQuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
