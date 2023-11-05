type ValueType = number

export abstract class Range {
  abstract includes(value: ValueType): boolean

  private static get SUBCLASSES(): { parse(expr: string): Range | null }[] {
    return [
      RangeUnion,
      RangeExclusive,
      RangeInclusive,
      RangeLtEq,
      RangeLt,
      RangeGtEq,
      RangeGt,
      RangeAny,
      RangeNone,
      RangeEq,
    ]
  }

  static parse(expr: string): Range | null {
    for (const subclass of this.SUBCLASSES) {
      const range: Range | null = subclass.parse(expr)

      if (range !== null)
        return range
    }

    return null
  }

  protected static parseValue(value: string): ValueType {
    return Number.parseInt(value)
  }
}

class RangeUnion extends Range {
  protected constructor(readonly ranges: readonly Range[]) {
    super()
  }

  static override parse(expr: string): Range | null {
    if (/[, ]/.exec(expr) === null)
      return null

    const ranges: Range[] = []
    for (const innerExpr of expr.split(/[, ]+/)) {
      const innerRange: Range | null = Range.parse(innerExpr)
      if (innerRange === null)
        return null

      ranges.push(innerRange)
    }

    return new this(ranges)
  }

  override includes(value: ValueType): boolean {
    return this.ranges.some(range => range.includes(value))
  }
}

class RangeExclusive extends Range {
  protected static readonly REGEX = /^(.+?)\.\.\.(.+)/

  protected constructor(
    readonly start: ValueType,
    readonly end: ValueType,
  ) {
    super()
  }

  static override parse(expr: string): Range | null {
    const match = this.REGEX.exec(expr)
    if (match === null)
      return null

    const start = this.parseValue(match[1]!)
    const end = this.parseValue(match[2]!)
    return new this(start, end)
  }

  override includes(value: ValueType): boolean {
    return this.start <= value && value < this.end
  }
}

class RangeInclusive extends RangeExclusive {
  protected static override readonly REGEX = /^(.+?)\.\.(.+)/

  override includes(value: ValueType): boolean {
    return this.start <= value && value <= this.end
  }
}

class RangeGt extends Range {
  protected static readonly REGEX = /^>(.+)/

  protected constructor(readonly value: ValueType) {
    super()
  }

  static override parse(expr: string): Range | null {
    const match = this.REGEX.exec(expr)
    if (match === null)
      return null

    const value = this.parseValue(match.filter(Boolean)[1]!)
    return new this(value)
  }

  override includes(value: ValueType): boolean {
    return value > this.value
  }
}

class RangeLt extends RangeGt {
  protected static override readonly REGEX = /^<(.+)/

  override includes(value: ValueType): boolean {
    return value < this.value
  }
}

class RangeGtEq extends RangeGt {
  protected static override readonly REGEX = /^(?:>=(.+)|(.+)\.\.$)/

  override includes(value: ValueType): boolean {
    return value >= this.value
  }
}

class RangeLtEq extends RangeGt {
  protected static override readonly REGEX = /^(?:<=(.+)|\.\.(.+))/

  override includes(value: ValueType): boolean {
    return value <= this.value
  }
}

class RangeNone extends Range {
  protected static readonly VALUE: string = 'none'

  static override parse(expr: string): Range | null {
    if (expr !== this.VALUE)
      return null

    return new this()
  }

  override includes(value: ValueType): boolean {
    return Number.isNaN(value)
  }
}

class RangeAny extends RangeNone {
  protected static override readonly VALUE: string = 'any'

  override includes(value: ValueType): boolean {
    return !super.includes(value)
  }
}

class RangeEq extends Range {
  protected constructor(readonly value: ValueType) {
    super()
  }

  static override parse(expr: string): Range {
    const value = this.parseValue(expr)
    return new this(value)
  }

  override includes(value: ValueType): boolean {
    return value === this.value
  }
}
