import { AbstractControl, ValidatorFn } from '@angular/forms';

export class PasswordValidator {
  public static mismatchedPasswords = (): ValidatorFn => {
    return (group: AbstractControl): { [key: string]: any } => {
      const newPasswordValue = group.get('password').value;
      const newPasswordConfirmValue = group.get('password_confirm').value;
      if (newPasswordValue !== newPasswordConfirmValue) {
        group.get('password_confirm')
          .setErrors({ 'mismatchedPasswords': true });
        return { 'mismatchedPasswords': true };
      }
      return undefined;
    };
  }
}
