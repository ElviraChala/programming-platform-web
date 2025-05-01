import {Component, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {QuestionService} from "../../service/question.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Question} from "../../interface/Question";

@Component({
  selector: "app-question",
  templateUrl: "./question.component.html",
  styleUrl: "./question.component.css",
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuestionComponent),
      multi: true
    }
  ]
})
export class QuestionComponent implements ControlValueAccessor, OnChanges {

  @Input() idQuestion!: number;
  @Output() changeAnswer = new EventEmitter<string>();

  question?: Question;
  selectedOption?: string;
  private onChange = (_: any) => {
  };
  private onTouched = () => {
  };

  constructor(private readonly questionService: QuestionService) {
  }

  writeValue(obj: string): void {
    this.selectedOption = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnChanges(changes: SimpleChanges): void {
    let id = changes["idQuestion"]?.currentValue;

    if (id == null || id === -1) {
      return;
    }

    this.questionService.getQuestionById(String(id))
      .subscribe({
        next: value => {
          this.question = value;
        },
        error: value => {
          console.error(value);
        }
      });
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.onChange(option);
    this.onTouched();
  }
}
