declare function route(name: string, params?: RouteParams, absolute?: boolean): string;

interface RouteParams {
    [key: string]: RouteParam;
}

type RouteParam =
    | string
    | number
    | boolean
    | undefined
    | RouteParams
    | (string | number | boolean | undefined | RouteParams)[];
