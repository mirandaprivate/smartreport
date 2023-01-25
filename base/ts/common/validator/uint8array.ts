import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'

function equals(
    value1: Readonly<Uint8Array>,
    value2: Readonly<Uint8Array>,
): boolean {
    if (value1.length !== value2.length)
        return false
    return value1.find((v: number, i: number): boolean => value2[i] !== v)
        === undefined
}

@ValidatorConstraint({async: false})
class EqualsConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(
        value: Readonly<Uint8Array>,
        args: ValidationArguments,
    ): boolean {
        if (args.constraints.length === 0)
            return true
        const compare: Readonly<Uint8Array> = args.constraints[0]
        return equals(value, compare)
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const value: Readonly<Uint8Array> = args.constraints[0]
        return `$property must be equal to [${value}]`
    }
}

/**
 * Check whether the value is equal to the given Uint8Array value.
 */
export function uint8ArrayEquals(
    value: Readonly<Uint8Array>,
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

@ValidatorConstraint({async: false})
class LengthConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(
        value: Readonly<Uint8Array>,
        args: ValidationArguments,
    ): boolean {
        if (args.constraints.length <= 1)
            return true
        const min: number = args.constraints[0]
        const max: number = args.constraints[1]
        return value.length >= min && (max === -1 || value.length <= max)
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
            return `$property must be ${min} bytes long`
        if (max === -1)
            return `$property must be at least ${min} bytes long`
        return `$property must be between ${min} and ${max} bytes long`
    }
}

/**
 * Check whether the Uint8Array length is between the min and max.
 */
export function uint8ArrayLength(
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

@ValidatorConstraint({async: false})
class PrefixConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(
        value: Readonly<Uint8Array>,
        args: ValidationArguments,
    ): boolean {
        if (args.constraints.length === 0)
            return true
        const prefix: Readonly<Uint8Array> = args.constraints[0]
        if (value.length < prefix.length)
            return false
        return prefix.find((v: number, i: number): boolean => v !== value[i])
            === undefined
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const value: Readonly<Uint8Array> = args.constraints[0]
        return `$property must have the prefix [${value}]`
    }
}

/**
 * Check whether the Uint8Array value has the given prefix.
 */
export function uint8ArrayPrefix(
    prefix: Readonly<Uint8Array>,
    opts: ValidationOptions = {},
): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [prefix],
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
    public validate(
        value: Readonly<Uint8Array>,
        args: ValidationArguments,
    ): boolean {
        if (args.constraints.length === 0)
            return true
        const suffix: Readonly<Uint8Array> = args.constraints[0]
        if (value.length < suffix.length)
            return false
        const suffixReverse = new Uint8Array(suffix).reverse()
        return suffixReverse.find((v: number, i: number): boolean =>
            v !== value[value.length - 1 - i],
        ) === undefined
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const value: Readonly<Uint8Array> = args.constraints[0]
        return `$property must have the suffix [${value}]`
    }
}

/**
 * Check whether the Uint8Array value has the given suffix.
 */
export function uint8ArraySuffix(
    suffix: Readonly<Uint8Array>,
    opts: ValidationOptions = {},
): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [suffix],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: SuffixConstraint,
        })
    }
}

@ValidatorConstraint({async: false})
class ContainsConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(
        value: Readonly<Uint8Array>,
        args: ValidationArguments,
    ): boolean {
        if (args.constraints.length === 0)
            return true
        const contain: Readonly<Uint8Array> = args.constraints[0]
        if (value.length < contain.length)
            return false
        const containToStr = String.fromCharCode(
            ...Array.from(contain.values()),
        )
        const valueToStr = String.fromCharCode(...Array.from(value.values()))
        return valueToStr.includes(containToStr)
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const value: Readonly<Uint8Array> = args.constraints[0]
        return `$property must contain the bytes [${value}]`
    }
}

/**
 * Check whether the Uint8Array value contains the given value.
 */
export function uint8ArrayContains(
    contain: Readonly<Uint8Array>,
    opts: ValidationOptions = {},
): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [contain],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: ContainsConstraint,
        })
    }
}

// tslint:disable-next-line: max-classes-per-file
@ValidatorConstraint({async: false})
class IsInConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(
        value: Readonly<Uint8Array>,
        args: ValidationArguments,
    ): boolean {
        if (args.constraints.length === 0)
            return true
        const array: readonly Readonly<Uint8Array>[] = args.constraints[0]
        return array.find((
            v: Readonly<Uint8Array>,
        ): boolean => equals(v, value),
        ) !== undefined
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const values: Readonly<Uint8Array>[] = args.constraints[0]
        return `$property must be in ${values
            .map((v: Readonly<Uint8Array>): string => `[${v.toString()}]`)
            .join(', ')}`
    }
}

/**
 * Check whether the Uint8Array value is in the given array.
 */
export function uint8ArrayIsIn(
    array: readonly Readonly<Uint8Array>[],
    opts: ValidationOptions = {},
): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [array],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: IsInConstraint,
        })
    }
}

// tslint:disable-next-line: max-classes-per-file
@ValidatorConstraint({async: false})
class IsNotInConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(
        value: Readonly<Uint8Array>,
        args: ValidationArguments,
    ): boolean {
        if (args.constraints.length === 0)
            return true
        const array: readonly Readonly<Uint8Array>[] = args.constraints[0]
        return array.find((
            v: Readonly<Uint8Array>,
        ): boolean => equals(v, value),
        ) === undefined
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const values: Readonly<Uint8Array>[] = args.constraints[0]
        return `$property must be not in ${values
            .map((v: Readonly<Uint8Array>): string => `[${v.toString()}]`)
            .join(', ')}`
    }
}

/**
 * Check whether the Uint8Array value is not in the given array.
 */
export function uint8ArrayIsNotIn(
    array: readonly Readonly<Uint8Array>[],
    opts: ValidationOptions = {},
): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [array],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: IsNotInConstraint,
        })
    }
}

// tslint:disable-next-line: max-classes-per-file
@ValidatorConstraint({async: false})
class MatchesConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(
        value: Readonly<Uint8Array>,
        args: ValidationArguments,
    ): boolean {
        if (args.constraints.length === 0)
            return true
        const pattern: RegExp = args.constraints[0]
        const valueToStr = String.fromCharCode(...Array.from(value.values()))
        return pattern.exec(valueToStr) !== null
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const value: RegExp = args.constraints[0]
        return `$property must match ${value}`
    }
}

/**
 * Check whether the Uint8Array value matches the pattern.
 */
export function uint8ArrayMatches(
    pattern: RegExp,
    opts: ValidationOptions = {},
): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [pattern],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: MatchesConstraint,
        })
    }
}

// tslint:disable-next-line: max-classes-per-file
@ValidatorConstraint({async: false})
class IsIpConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(
        ip: Readonly<Uint8Array>,
        args: ValidationArguments,
    ): boolean {
        if (args.constraints.length === 0)
            return true
        const verson: IpVerson.IPV4 | IpVerson.IPV6 | undefined
            = args.constraints[0]
        const ipv4Len = 4
        const ipv6Len = 16
        if (verson === IpVerson.IPV4 && ip.length !== ipv4Len)
            return false
        if (verson === IpVerson.IPV6 && ip.length !== ipv6Len)
            return false
        return ip.length === ipv4Len || ip.length === ipv6Len
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const verson: IpVerson.IPV4 | IpVerson.IPV6 | undefined
            = args.constraints[0]
        if (verson === IpVerson.IPV4)
            return '$property must be an ipv4 address'
        if (verson === IpVerson.IPV6)
            return '$property must be an ipv6 address'
        return '$property must be an ip address'
    }
}

const enum IpVerson {
    IPV4 = 4,
    IPV6 = 6,
}

/**
 * Check whether the Uint8Array value is an ip address.
 */
export function uint8ArrayIsIp(
    // tslint:disable-next-line: no-optional-parameter
    verson?: IpVerson.IPV4 | IpVerson.IPV6,
    opts: ValidationOptions = {},
): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [verson],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: IsIpConstraint,
        })
    }
// tslint:disable-next-line: max-file-line-count
}
