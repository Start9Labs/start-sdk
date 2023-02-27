export declare enum DiffType {
    removed = "removed",
    common = "common",
    added = "added"
}
export interface DiffResult<T> {
    type: DiffType;
    value: T;
}
/**
 * Renders the differences between the actual and expected values
 * @param A Actual value
 * @param B Expected value
 */
export declare function diff<T>(A: T[], B: T[]): Array<DiffResult<T>>;
