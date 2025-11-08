import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ErrorMessageComponent } from "../error-message/error-message.component";

@Component({
  selector: 'app-form-field',
  imports: [ErrorMessageComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true,
    },
  ],
  standalone: true,
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css',
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() fieldId: string = '';

  value: any;
  disabled: boolean = false;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  onBlur(){
    this.onTouched();
  }

  onInputChange(event:Event){
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }


  writeValue(val: any): void {
    this.value = val || '';
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
