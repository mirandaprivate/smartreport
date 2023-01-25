import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import {parse} from 'uri-js'

@ValidatorConstraint({async: false})
class PrefixConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(value: string, args: ValidationArguments): boolean {
        if (args.constraints.length === 0)
            return true
        const prefixStr: string = args.constraints[0]
        return value.startsWith(prefixStr)
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const value: string = args.constraints[0]
        return `$property must have the prefix '${value}'`
    }
}

/**
 * Check whether the string has the given prefix.
 */
export function prefix(value: string, opts: ValidationOptions = {}): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [value],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: PrefixConstraint,
        })
    }
}

@ValidatorConstraint({async: false})
class SuffixConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(value: string, args: ValidationArguments): boolean {
        if (args.constraints.length === 0)
            return true
        const suffixStr: string = args.constraints[0]
        return value.endsWith(suffixStr)
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const value: string = args.constraints[0]
        return `$property must have the suffix '${value}'`
    }
}

/**
 * Check whether the string has the given suffix.
 */
export function suffix(value: string, opts: ValidationOptions = {}): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [value],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: SuffixConstraint,
        })
    }
}

@ValidatorConstraint({async: false})
class IsUriConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(value: string, args: ValidationArguments): boolean {
        if (args.constraints.length === 0)
            return true
        const absolute: boolean = args.constraints[0]
        const components = parse(value)
        if (components.error !== undefined)
            return false
        return !absolute || components.reference !== 'relative'
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const absolute: boolean = args.constraints[0]
        if (absolute)
            return '$property must be a valid absolute URI'
        return '$property must be a valid URI reference'
    }
}

/**
 * Check whether the string is a valid URI.
 */
export function isUri(
    absolute = false,
    opts: ValidationOptions = {},
): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [absolute],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: IsUriConstraint,
        })
    }
}
