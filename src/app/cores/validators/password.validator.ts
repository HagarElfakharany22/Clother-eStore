import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class PasswordValidators {
  static StrongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value; 

      if (!value) {
        return null; 
      }

      const hasNumber = /[0-9]/.test(value);
      const hasUppercase = /[A-Z]/.test(value);
      const hasLowercase = /[a-z]/.test(value);
      const hasChar = /[^a-zA-Z0-9]/.test(value);
      const validLength = value.length >= 6;

      const isValidPassword =
        hasNumber && hasUppercase && hasLowercase && hasChar && validLength;

      return !isValidPassword ? { passwordStrength: true } : null;
    };
  }

  static matchPassword():ValidatorFn{
    return (control:AbstractControl):ValidationErrors | null=>{
        const value = control.value;
        const password = control.parent?.get('password')?.value;
        if(!value){
            return null
        }
        if(value != password){
            return{passwordismatch:true}
        }
        return null
    }
  }
}
