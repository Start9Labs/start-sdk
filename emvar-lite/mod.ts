
const starSub = /((\d+\.)*\d+)\.\*/

function incrementLastNumber(list: number[]) {
    const newList = [...list]
    newList[newList.length - 1]++
    return newList
}
export function rangeOf(range: string | Checker): Checker {
    if (range instanceof Checker) {
        return range
    }
    if (range === '*') return new Checker((version) => {
        EmVar.from(version)
        return true
    });
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
                return v.greaterThan(emVar) || v.equals(emVar);
            })
        }
        case '<=': {
            const emVar = EmVar.parse(range.substring(2));
            return new Checker((version) => {
                const v = EmVar.from(version);
                return !v.greaterThan(emVar);
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
                return !v.greaterThan(emVar) && !v.equals(emVar);
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

export function rangeAnd(...ranges: (string | Checker)[]): Checker {
    let [firstCheck, ...rest] = ranges.map(rangeOf);
    for (const checker of rest) {
        firstCheck = firstCheck.and(checker);
    }
    return firstCheck;
}

export function rangeOr(...ranges: (string | Checker)[]): Checker {
    let [firstCheck, ...rest] = ranges.map(rangeOf);
    for (const checker of rest) {
        firstCheck = firstCheck.or(checker);
    }
    return firstCheck;
}


export class EmVar {
    static from(range: string | EmVar): EmVar {
        if (range instanceof EmVar) {
            return range
        }
        return EmVar.parse(range)
    }
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
}

export class Checker {
    constructor(public readonly check: (value: string | EmVar) => boolean) { }

    public and(other: Checker): Checker {
        return new Checker((value) => this.check(value) && other.check(value));
    }
    public or(other: Checker): Checker {
        return new Checker((value) => this.check(value) || other.check(value));
    }
}