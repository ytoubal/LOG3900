// https://stackoverflow.com/questions/51605737/confirm-password-validation-in-angular-6
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/typings";

export class ErrorMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(control!.invalid && control!.parent!.dirty);
    const invalidParent = !!(
      control!.parent!.invalid && control!.parent!.dirty
    );

    return invalidCtrl || invalidParent;
  }
}
