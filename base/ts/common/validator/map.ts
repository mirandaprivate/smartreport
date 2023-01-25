import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({async: false})
class LengthConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(
        map: Map<unknown, unknown>,
        args: ValidationArguments,
    ): boolean {
        if (args.constraints.length <= 1)
            return true
        const min: number = args.constraints[0]
        const max: number = args.constraints[1]
        return map.size >= min && (max === -1 || map.size <= max)
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        if (args.constraints.length <= 1)
            return ''
        let min: number = args.constraints[0]
        min = min < 0 ? 0 : min
        const max: number = args.constraints[1]
        if (max < min)
            return 'the length limit of $property is wrong'
        if (max === min)
            return `$property must contain ${min} items`
        if (max === -1)
            return `$property must contain at least ${min} items`
        return `$property must contain between ${min} and ${max} items`
    }
}

/**
 * Check whether the length of map is in the given range.
 */
export function mapLength(
    min: number,
    max = -1,
    opts: ValidationOptions = {},
): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [min, max],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: LengthConstraint,
        })
    }
}
