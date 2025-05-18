import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { StudentEditComponent } from './student-edit.component';
import { StudentService } from '../../service/student.service';
import { Level } from '../../interface/Level';
import { Role } from '../../interface/Role';

describe('StudentEditComponent', () => {
  let component: StudentEditComponent;
  let fixture: ComponentFixture<StudentEditComponent>;
  let mockStudentService: jasmine.SpyObj<StudentService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  const mockStudent = {
    id: 1,
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    role: Role.STUDENT,
    score: 100,
    coursesId: [1, 2],
    isFirst: false,
    level: Level.MEDIUM
  };

  beforeEach(async () => {
    mockStudentService = jasmine.createSpyObj('StudentService', ['getAllStudents', 'updateStudent']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [StudentEditComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: StudentService, useValue: mockStudentService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    mockStudentService.getAllStudents.and.returnValue(of([mockStudent]));
    mockStudentService.updateStudent.and.returnValue(of(mockStudent));

    fixture = TestBed.createComponent(StudentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load student data on init', () => {
    expect(mockStudentService.getAllStudents).toHaveBeenCalled();
    expect(component.student).toEqual(mockStudent);
    expect(component.loading).toBeFalse();
  });

  it('should populate form with student data', () => {
    expect(component.editForm?.get('username')?.value).toBe(mockStudent.username);
    expect(component.editForm?.get('name')?.value).toBe(mockStudent.name);
    expect(component.editForm?.get('email')?.value).toBe(mockStudent.email);
    expect(component.editForm?.get('score')?.value).toBe(mockStudent.score);
    expect(component.editForm?.get('isFirst')?.value).toBe(mockStudent.isFirst);
    expect(component.editForm?.get('level')?.value).toBe(mockStudent.level);
  });

  it('should handle form submission', () => {
    component.onSubmit();
    expect(mockStudentService.updateStudent).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should handle cancel button click', () => {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should handle error when loading student', () => {
    mockStudentService.getAllStudents.and.returnValue(throwError(() => new Error('Test error')));
    component.loadStudent();
    expect(component.error).toBe('Failed to load student data');
    expect(component.loading).toBeFalse();
  });

  it('should handle error when updating student', () => {
    mockStudentService.updateStudent.and.returnValue(throwError(() => new Error('Test error')));
    component.onSubmit();
    expect(component.error).toBe('Failed to update student');
  });
});
