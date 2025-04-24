import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstCheckComponent } from './first-check.component';

describe('FirstCheckComponent', () => {
  let component: FirstCheckComponent;
  let fixture: ComponentFixture<FirstCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirstCheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
