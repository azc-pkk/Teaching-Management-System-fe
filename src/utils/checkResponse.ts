import type { ApiResponse } from "@/api/types"
import assertData from "./assert";

export default function checkResponse<T>(
    response: ApiResponse<T>,
): NonNullable<T> {
    if (!response.success) {
        const err = response.error;
        if (err === null) {
            throw new Error('Unknown Error.');
        } else {
            throw new Error(`
                Error Code: ${err.code}
                Message: ${err.message}
                Detail: ${err.details ?? 'None'}
                `);
        }
    }
    assertData(response.data);
    return response.data;
}