import { Directive } from '@angular/core';
import {AbstractControl,ValidationErrors,Validator,ValidatorFn} from '@angular/forms';
import{Subscription} from 'rxjs';
export function compareValidator(controlNameTocompare: string): ValidatorFn {
	return (c: AbstractControl): ValidationErrors | null => {
		if(c.value === null || c.value.length === 0) {
			return null;
		}
		const controlToCompare = c.root.get(controlNameTocompare);
		if(controlToCompare){
			const subscription: Subscription = controlToCompare.valueChanges.subscribe(() => {
				c.updateValueAndValidity();
				subscription.unsubscribe();
			});
		}
		return controlToCompare && controlToCompare.value !== c.value ? {'compare': true} : null;
	};
}

export function phoneNumberValidator(control: AbstractControl): { [key: string]: any } | null {
  const valid = /^\d+$/.test(control.value);
  return valid ? null : { invalidNumber: { valid: false, value: control.value } };
}
@Directive({
  selector: '[appCompare]'
})
export class CompareDirective {

  constructor() { }

}
