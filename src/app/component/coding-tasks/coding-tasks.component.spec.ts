import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodingTaskComponent } from './coding-tasks.component';

describe('CodingTasksComponent', () => {
  let component: CodingTaskComponent;
  let fixture: ComponentFixture<CodingTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CodingTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodingTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
