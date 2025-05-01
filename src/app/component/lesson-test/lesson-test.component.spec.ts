import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonTestComponent } from './lesson-test.component';

describe('LessonTestComponent', () => {
  let component: LessonTestComponent;
  let fixture: ComponentFixture<LessonTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LessonTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
