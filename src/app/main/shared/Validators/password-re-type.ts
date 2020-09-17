import { Validator, AbstractControl, NG_VALIDATORS, ValidatorFn, FormGroup, ValidationErrors, FormBuilder } from '@angular/forms';

export function passMatchValidator(pass: string, rePass: string): ValidatorFn {
  return(fg: FormGroup) => {
    const result = fg.get(pass).value === fg.get(rePass).value;
    if (result) {
      fg.get(rePass).setErrors( null );
      return null;
    }
    fg.get(rePass).setErrors({match: false});
    return {match: false};
  };
}

