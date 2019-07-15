import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from './validators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Angular-Material-Chips-with-Reactive-Forms-and-Custom-Validation';

  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE]; // 1
  emails = []; // array of chips' values
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
// Init a form with the FormBuilder:
    this.form =  this.formBuilder.group({
      // emails: [this.emails, []]
      emails: [this.emails, [CustomValidators.validateRequired, CustomValidators.validateEmails]]
    });
    this.form.controls.emails.setValue(this.emails); // 2
  }

// MatChipList callbacks:
  addEmail(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;
    if ((value.trim() !== '')) {
      this.form.controls.emails.setErrors(null);   // 1
      const tempEmails = this.form.controls.emails.value; // 2
      tempEmails.push(value.trim());
      this.form.controls.emails.setValue(tempEmails);     // 3
      if (this.form.controls.emails.valid) {              // 4
        this.form.controls.emails.markAsDirty();
        input.value = '';                                    // 5
      } else {
        const index = this.emails.findIndex(value1 => value1 === value.trim());
        if (index !== -1) {
          this.emails.splice(index, 1);           // 6
        }
      }
    } else {
      this.form.controls.emails.updateValueAndValidity();  // 7
    }
  }

  onRemoveEmail(email: any) {
    // const controller = this.form.controls.emails;
    // const index = this.emails.indexOf(email, 0);
    // if (index > -1) {
    //   this.emails.splice(index, 1);
    // }
    // controller.markAsDirty();

    const controller = this.form.controls.emails;
    const index = this.emails.indexOf(email, 0);
    if (index > -1) {
      this.emails.splice(index, 1);
    }
    controller.updateValueAndValidity();  // <---- Here it is
    controller.markAsDirty();
  }
//
  onSubmit() {
    console.log('Hello');
    this.form.controls.emails.markAsTouched();
    if (this.form.valid) {
      console.log('Ready to go: ', this.form.controls.emails.value);
    }
  }
}
