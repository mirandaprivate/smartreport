import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import Long from 'long'

interface Inequality {
    readonly lt?: Long,
    readonly gt?: Long,
    readonly lte?: Long,
    readonly gte?: Long,
}

@ValidatorConstraint({async: false})
class CompareConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(num: Long, args: ValidationArguments): boolean {
        if (args.constraints.length === 0)
            return true
        const i: Inequality = args.constraints[0]
        const lt = i.lt ?? i.lte
        const gt = i.gt ?? i.gte
        if ((i.gte !== undefined && i.gte.eq(num)) ||
            i.lte !== undefined && i.lte.eq(num))
            return true
        if (lt !== undefined && gt === undefined)
            return num.lt(lt)
        if (gt !== undefined && lt === undefined)
            return num.gt(gt)
        if (gt === undefined || lt === undefined)
            return true
        if (gt < lt)
            return num.gt(gt) && num.lt(lt)
        return num.gt(gt) || num.lt(lt)
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const i: Inequality = args.constraints[0]
        const lt = i.lt ?? i.lte
        const gt = i.gt ?? i.gte
        return [
            '$property must be',
            gt !== undefined
                ? ` greater than ${i.gte !== undefined ? 'or equal to ' : ''}${gt}`
                : '',
            gt !== undefined && lt !== undefined && gt < lt ? ' and' : '',
            gt !== undefined && lt !== undefined && gt > lt ? ' or' : '',
            lt !== undefined
                ? ` less than ${i.lte !== undefined ? 'or equal to ' : ''}${lt}`
                : '',
        ].join('')
    }
}

/**
 * Compare the Long number with the inequalities.
 */
export function longCompare(
    inequality: Inequality,
    opts: ValidationOptions = {},
): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [inequality],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: CompareConstraint,
        })
    }
}

@ValidatorConstraint({async: false})
class IsInConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(num: Long, args: ValidationArguments): boolean {
        if (args.constraints.length === 0)
            return true
        const values: Long[] = args.constraints[0]
        return values.find((v: Long): boolean => num.eq(v)) !== undefined
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const values: Long[] = args.constraints[0]
        return `$property must be in ${values}`
    }
}

/**
 * Check whether the Long value is in this array.
 */
export function longIsIn(
    values: readonly Long[],
    opts: ValidationOptions = {},
): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [values],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: IsInConstraint,
        })
    }
}

@ValidatorConstraint({async: false})
class IsNotInConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(num: Long, args: ValidationArguments): boolean {
        if (args.constraints.length === 0)
            return true
        const values: Long[] = args.constraints[0]
        return values.find((v: Long): boolean => num.eq(v)) === undefined
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const values: Long[] = args.constraints[0]
        return `$property must be not in ${values}`
    }
}

/**
 * Check whether the Long value is not in this array.
 */
export function longIsNotIn(
    values: readonly Long[],
    opts: ValidationOptions = {},
): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [values],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: IsNotInConstraint,
        })
    }
}

@ValidatorConstraint({async: false})
class EqualsConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(num: Long, args: ValidationArguments): boolean {
        if (args.constraints.length === 0)
            return true
        const value: Long = args.constraints[0]
        return num.equals(value)
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const value: Long = args.constraints[0]
        return `$property must be equal to ${value}`
    }
}

/**
 * Check whether the Long value is equal to the given value.
 */
export function longEquals(
    value: Long,
    opts: ValidationOptions = {},
): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [value],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: EqualsConstraint,
        })
    }
}
