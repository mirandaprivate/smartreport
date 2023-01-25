import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import Long from 'long'

@ValidatorConstraint({async: false})
class AnyIsInConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(
        value: {readonly typeUrl: string},
        args: ValidationArguments,
    ): boolean {
        if (args.constraints.length === 0)
            return true
        const typeUrls: readonly string[] = args.constraints[0]
        return typeUrls.includes(value.typeUrl)
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const typeUrls: readonly string[] = args.constraints[0]
        return `$property must be in [${typeUrls}]`
    }
}

/**
 * Check whether the type_url of any is in the given strings.
 */
export function anyIsIn(
    typeUrls: readonly string[],
    opts: ValidationOptions = {},
): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [typeUrls],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: AnyIsInConstraint,
        })
    }
}

@ValidatorConstraint({async: false})
class AnyIsNotInConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(
        value: {readonly typeUrl: string},
        args: ValidationArguments,
    ): boolean {
        if (args.constraints.length === 0)
            return true
        const typeUrls: readonly string[] = args.constraints[0]
        return !typeUrls.includes(value.typeUrl)
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const typeUrls: readonly string[] = args.constraints[0]
        return `$property must be not in [${typeUrls}]`
    }
}

/**
 * Check whether the type_url of any is not in the given strings.
 */
export function anyIsNotIn(
    typeUrls: readonly string[],
    opts: ValidationOptions = {},
): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [typeUrls],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: AnyIsNotInConstraint,
        })
    }
}

interface Timestamp {
    readonly seconds: Long,
    readonly nanos: number,
}

interface Duration {
    readonly seconds: Long,
    readonly nanos: number,
}

function timestampEq(x: Timestamp, y: Timestamp): boolean {
    return x.seconds.eq(y.seconds) && x.nanos === y.nanos
}

function timestampLt(x: Timestamp, y: Timestamp): boolean {
    if (x.seconds.lt(y.seconds))
        return true
    if (x.seconds.gt(y.seconds))
        return false
    return x.seconds.isPositive() ? x.nanos < y.nanos : x.nanos > y.nanos
}

function timestampGt(x: Timestamp, y: Timestamp): boolean {
    if (x.seconds.gt(y.seconds))
        return true
    if (x.seconds.lt(y.seconds))
        return false
    return x.seconds.isPositive() ? x.nanos > y.nanos : x.nanos < y.nanos
}

function getNowTimestamp(): Timestamp {
    const now = new Date()
    const precision = 1000
    return {
        // tslint:disable-next-line: no-magic-numbers
        nanos: now.getTime() % precision * 1000000000 / precision,
        seconds: Long.fromNumber(Math.floor(now.getTime() / precision)),
    }
}

@ValidatorConstraint({async: false})
class TimestampConstConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(time: Timestamp, args: ValidationArguments): boolean {
        if (args.constraints.length === 0)
            return true
        const compare: Timestamp = args.constraints[0]
        return timestampEq(time, compare)
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const time: Timestamp = args.constraints[0]
        return `$property must be quals to ${time}`
    }
}

/**
 * Check whether the timestamp is equals to the given time.
 */
export function timestampEquals(
    time: Timestamp,
    opts: ValidationOptions = {},
): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [time],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: TimestampConstConstraint,
        })
    }
}

@ValidatorConstraint({async: false})
class TimestampCompareConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(time: Timestamp, args: ValidationArguments): boolean {
        if (args.constraints.length === 0)
            return true
        const i: TimestampInequality = args.constraints[0]
        const lt = i.lt ?? i.lte
        const gt = i.gt ?? i.gte
        if (i.gte !== undefined && timestampEq(i.gte, time) ||
            i.lte !== undefined && timestampEq(i.lte, time))
            return true
        if (lt !== undefined && gt === undefined)
            return timestampLt(time, lt)
        if (gt !== undefined && lt === undefined)
            return timestampGt(time, gt)
        if (gt === undefined || lt === undefined)
            return true
        if (timestampLt(gt, lt))
            return timestampGt(time, gt) && timestampLt(time, lt)
        return timestampGt(time, gt) || timestampLt(time, lt)
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const i: TimestampInequality = args.constraints[0]
        const lt = i.lt ?? i.lte
        const gt = i.gt ?? i.gte
        return [
            '$property must be',
            gt !== undefined
                ? ` greater than ${i.gte !== undefined ? 'or equal to ' : ''}${gt}`
                : '',
            gt !== undefined && lt !== undefined && timestampLt(gt, lt)
                ? ' and'
                : '',
            gt !== undefined && lt !== undefined && timestampGt(gt, lt)
                ? ' or'
                : '',
            lt !== undefined
                ? ` less than ${i.lte !== undefined ? 'or equal to ' : ''}${lt}`
                : '',
        ].join('')
    }
}

interface TimestampInequality {
    readonly lt?: Timestamp,
    readonly gt?: Timestamp,
    readonly lte?: Timestamp,
    readonly gte?: Timestamp,
}

/**
 * Compare the timestamp with the given inequalities.
 */
export function timestampCompare(
    inequality: TimestampInequality,
    opts: ValidationOptions = {},
): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [inequality],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: TimestampCompareConstraint,
        })
    }
}

@ValidatorConstraint({async: false})
class TimestampLtNowConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(time: Timestamp, args: ValidationArguments): boolean {
        if (args.constraints.length !== 0)
            return true
        return timestampLt(time, getNowTimestamp())
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        if (args.constraints.length !== 0)
            return ''
        return '$property must be less than the current time'
    }
}

/**
 * Check whether the timestamp is less than the current time.
 */
export function timestampLtNow(opts: ValidationOptions = {}): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: TimestampLtNowConstraint,
        })
    }
}

// tslint:disable-next-line: max-classes-per-file
@ValidatorConstraint({async: false})
class TimestampGtNowConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(time: Timestamp, args: ValidationArguments): boolean {
        if (args.constraints.length !== 0)
            return true
        return timestampGt(time, getNowTimestamp())
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        if (args.constraints.length !== 0)
            return ''
        return '$property must be greater than the current time'
    }
}

/**
 * Check whether the timestamp is greater than the current time.
 */
export function timestampGtNow(opts: ValidationOptions = {}): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: TimestampGtNowConstraint,
        })
    }
}

// tslint:disable-next-line: max-classes-per-file
@ValidatorConstraint({async: false})
class TimestampWithinConstraint implements ValidatorConstraintInterface {
    // tslint:disable-next-line: prefer-function-over-method
    public validate(time: Timestamp, args: ValidationArguments): boolean {
        if (args.constraints.length === 0)
            return true
        const now = getNowTimestamp()
        let duration: Duration = args.constraints[0]
        duration = duration.nanos < 0
            ? {seconds: duration.seconds.neg(), nanos: - duration.nanos}
            : duration
        let max: Timestamp = {
            nanos: now.nanos + duration.nanos,
            seconds: now.seconds.add(duration.seconds),
        }
        const precision = 1000000000
        if (max.nanos >= precision)
            max = {nanos: max.nanos - precision, seconds: max.seconds.add(1)}
        let min: Timestamp = {
            nanos: now.nanos - duration.nanos,
            seconds: now.seconds.add(duration.seconds.neg()),
        }
        if (min.nanos < 0)
            min = {nanos: min.nanos + precision, seconds: min.seconds.add(-1)}
        return timestampEq(time, min) || timestampEq(time, max)
            || timestampGt(time, min) && timestampLt(time, max)
    }

    // tslint:disable-next-line: prefer-function-over-method
    public defaultMessage(args: ValidationArguments): string {
        const d: Duration = args.constraints[0]
        return '$property must be within ' +
            `±(${d.seconds} seconds, ${d.nanos} nanos) ` +
            'of the current time'
    }
}

/**
 * Check whether the timestamp is within the given time of current time.
 */
export function timestampWithin(
    duration: Duration,
    opts: ValidationOptions = {},
): Function {
    return (obj: object, prop: string): void => {
        registerDecorator({
            constraints: [duration],
            options: opts,
            propertyName: prop,
            target: obj.constructor,
            validator: TimestampWithinConstraint,
        })
    }
}
