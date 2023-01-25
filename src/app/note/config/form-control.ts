import {FormControl} from '@angular/forms'
export function setValue<T>(ctl: FormControl, value: T) {
    ctl.setValue(value)
}

export function getValue<T>(ctl: FormControl): T | undefined {
    return ctl.value
}
