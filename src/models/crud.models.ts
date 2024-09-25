export interface CrudSlice<T> {
    data: T,
    loading: boolean;
    error: string | null;
}