import { AbstractControl, ValidatorFn } from '@angular/forms';

export class PasswordValidator {
  public static mismatchedPasswords = (): ValidatorFn => {
    return (group: AbstractControl): { [key: string]: any } => {
      const passwordField = group.get('password');
      const passwordConfirmField = group.get('password_confirm');

      if (passwordField && passwordConfirmField && passwordField.value !== passwordConfirmField.value) {
        passwordConfirmField.setErrors({ 'mismatchedPasswords': true });
        return { 'mismatchedPasswords': true };
      }
      return undefined;
    };
  }
}
