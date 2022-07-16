
const starSub = /((\d+\.)*\d+)\.\*/

function incrementLastNumber(list: number[]) {
    const newList = [...list]
    newList[newList.length - 1]++
    return newList
}
/**
 * Will take in a range, like `>1.2` or `<1.2.3.4` or `=1.2` or `1.*`
 * and return a checker, that has the check function for checking that a version is in the valid
 * @param range 
 * @returns 
 */
export function rangeOf(range: string | Checker): Checker {
    return Checker.parse(range)
}

/**
 * Used to create a checker that will `and` all the ranges passed in
 * @param ranges
 * @returns 
 */
export function rangeAnd(...ranges: (string | Checker)[]): Checker {
    if (ranges.length === 0) {
        throw new Error('No ranges given');
    }
    const [firstCheck, ...rest] = ranges;
    return Checker.parse(firstCheck).and(...rest);
}

/**
 * Used to create a checker that will `or` all the ranges passed in
 * @param ranges
 * @returns 
 */
export function rangeOr(...ranges: (string | Checker)[]): Checker {
    if (ranges.length === 0) {
        throw new Error('No ranges given');
    }
    const [firstCheck, ...rest] = ranges;
    return Checker.parse(firstCheck).or(...rest);
}

/**
 * This will negate the checker, so given a checker that checks for >= 1.0.0, it will check for < 1.0.0
 * @param range 
 * @returns 
 */
export function notRange(range: string | Checker): Checker {
    return rangeOf(range).not();
}


/**
 * EmVar is a set of versioning of any pattern like 1 or 1.2 or 1.2.3 or 1.2.3.4 or ..
 */
export class EmVar {
    /**
     * Convert the range, should be 1.2.* or * into a emvar
     * Or an already made emvar
     * IsUnsafe
     */
    static from(range: string | EmVar): EmVar {
        if (range instanceof EmVar) {
            return range
        }
        return EmVar.parse(range)
    }
    /**
     * Convert the range, should be 1.2.* or * into a emvar
     * IsUnsafe
     */
    static parse(range: string): EmVar {
        const values = range.split('.').map(x => parseInt(x));
        for (const value of values) {
            if (isNaN(value)) {
                throw new Error(`Couldn't parse range: ${range}`);
            }
        }
        return new EmVar(values);
    }
    private constructor(public readonly values: number[]) { }

    /**
     * Used when we need a new emvar that has the last number incremented, used in the 1.* like things
     */
    public withLastIncremented() {
        return new EmVar(incrementLastNumber(this.values))
    }

    public greaterThan(other: EmVar): boolean {
        for (const i in this.values) {
            if (other.values[i] == null) {
                return true
            }
            if (this.values[i] > other.values[i]) {
                return true;
            }

            if (this.values[i] < other.values[i]) {
                return false;
            }
        }
        return false;
    }

    public equals(other: EmVar): boolean {
        if (other.values.length !== this.values.length) {
            return false
        }
        for (const i in this.values) {
            if (this.values[i] !== other.values[i]) {
                return false;
            }
        }
        return true;
    }
    public greaterThanOrEqual(other: EmVar): boolean {
        return this.greaterThan(other) || this.equals(other);
    }
    public lessThanOrEqual(other: EmVar): boolean {
        return !this.greaterThan(other);
    }
    public lessThan(other: EmVar): boolean {
        return !this.greaterThanOrEqual(other);
    }
}

/**
 * A checker is a function that takes a version and returns true if the version matches the checker.
 * Used when we are doing range checking, like saying ">=1.0.0".check("1.2.3") will be true
 */
export class Checker {
    /**
    * Will take in a range, like `>1.2` or `<1.2.3.4` or `=1.2` or `1.*`
    * and return a checker, that has the check function for checking that a version is in the valid
     * @param range 
     * @returns 
     */
    static parse(range: string | Checker): Checker {
        if (range instanceof Checker) {
            return range
        }
        range = range.trim();
        if (range.indexOf('||') !== -1) {
            return rangeOr(...range.split('||').map(x => Checker.parse(x)));
        }
        if (range.indexOf('&&') !== -1) {
            return rangeAnd(...range.split('&&').map(x => Checker.parse(x)));
        }
        if (range === '*') return new Checker((version) => {
            EmVar.from(version)
            return true
        });
        if (range.startsWith('!')) {
            return Checker.parse(range.substring(1)).not()
        }
        const starSubMatches = starSub.exec(range)
        if (starSubMatches != null) {
            const emVarLower = EmVar.parse(starSubMatches[1])
            const emVarUpper = emVarLower.withLastIncremented()

            return new Checker((version) => {
                const v = EmVar.from(version);
                return (v.greaterThan(emVarLower) || v.equals(emVarLower)) && !v.greaterThan(emVarUpper) && !v.equals(emVarUpper);
            })
        }

        switch (range.substring(0, 2)) {
            case '>=': {
                const emVar = EmVar.parse(range.substring(2));
                return new Checker((version) => {
                    const v = EmVar.from(version);
                    return v.greaterThanOrEqual(emVar)
                })
            }
            case '<=': {
                const emVar = EmVar.parse(range.substring(2));
                return new Checker((version) => {
                    const v = EmVar.from(version);
                    return v.lessThanOrEqual(emVar);
                })
            }

        }

        switch (range.substring(0, 1)) {
            case '>': {
                console.log('greaterThan')
                const emVar = EmVar.parse(range.substring(1));
                return new Checker((version) => {
                    const v = EmVar.from(version);
                    return v.greaterThan(emVar);
                })
            }
            case '<': {
                const emVar = EmVar.parse(range.substring(1));
                return new Checker((version) => {
                    const v = EmVar.from(version);
                    return v.lessThan(emVar)
                })
            }
            case '=': {
                const emVar = EmVar.parse(range.substring(1));
                return new Checker((version) => {
                    const v = EmVar.from(version);
                    return v.equals(emVar);
                })
            }

        }
        throw new Error("Couldn't parse range: " + range);
    }
    constructor(
        /**
         * Check is the function that will be given a emvar or unparsed emvar and should give if it follows
         * a pattern
         */
        public readonly check: (value: string | EmVar) => boolean
    ) { }


    public and(...others: (Checker | string)[]): Checker {
        return new Checker((value) => {
            if (!this.check(value)) {
                return false;
            }
            for (const other of others) {
                if (!Checker.parse(other).check(value)) {
                    return false
                }
            }
            return true
        });
    }
    public or(...others: (Checker | string)[]): Checker {
        return new Checker((value) => {
            if (this.check(value)) {
                return true;
            }
            for (const other of others) {
                if (Checker.parse(other).check(value)) {
                    return true
                }
            }
            return false
        });
    }
    public not(): Checker {
        return new Checker((value) => !this.check(value));
    }
}