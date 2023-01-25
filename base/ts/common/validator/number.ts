import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'

interface Inequality {
    readonly lt?: number,
    readonly gt?: number,
    readonly lte?: number,
    readonly gte?: number,
}

@ValidatorConstraint({async: false})
class CompareConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(num: number, args: ValidationArguments): boolean {
        const i: Inequality = args.constraints[0]
        const lt = i.lt ?? i.lte
        const gt = i.gt ?? i.gte
        if ((i.gte !== undefined && i.gte === num) ||
            i.lte !== undefined && i.lte === num)
            return true
        if (lt !== undefined && gt === undefined)
            return num < lt
        if (gt !== undefined && lt === undefined)
            return num > gt
        if (gt === undefined || lt === undefined)
            return true
        if (gt < lt)
            return num > gt && num < lt
        return num > gt || num < lt
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
 * Compare the number with the inequalities.
 */
export function compare(
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
