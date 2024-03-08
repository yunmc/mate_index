export interface HomeState {
    list: Array<any>;
    page: number;
    pageSize: number | string;
    loading: boolean;
    finish: boolean;
}
