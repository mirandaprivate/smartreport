import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({async: false})
class UniqueConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(
        array: readonly unknown[],
        args: ValidationArguments,
    ): boolean {
        if (args.constraints.length !== 0)
            return true
        return array.find((x: unknown, i: number): boolean =>
            array.slice(i + 1).find((y: unknown): boolean =>
                deepEqual(x, y),
            ) !== undefined,
        ) === undefined
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        if (args.constraints.length !== 0)
            return ''
        return 'items in $property must be unique'
    }
}

function deepEqual(x: unknown, y: unknown): boolean {
    if (x === y)
        return true
    if (typeof x !== 'object' || x === null
        || typeof y !== 'object' || y === null)
        return false
    if (Reflect.ownKeys(x).length !== Reflect.ownKeys(y).length)
        return false
    return Reflect.ownKeys(x).find((key: string | number | symbol): boolean =>
        !Reflect.has(y, key) ||
        !deepEqual(Reflect.get(x, key), Reflect.get(y, key)),
    ) === undefined
}

/**
 * Check whether items in this array are unique to each others.
 */
export function arrayUnique(opts: ValidationOptions = {}): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: UniqueConstraint,
        })
    }
}
