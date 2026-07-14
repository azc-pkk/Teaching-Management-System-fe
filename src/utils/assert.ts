export default function assertData<T>(
    data: T | null
): asserts data is NonNullable<T> {
    if (data === null) {
        throw new Error('Empty Response.');
    }
}