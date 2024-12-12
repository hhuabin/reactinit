import { Home, NotFound } from './lazyComponents'

export type RouteRecordRaw = {
    path: string;
    element: JSX.Element;
    name?: string | symbol;
    redirect?: string;
    // alias?: string | string[];
    children?: RouteRecordRaw[];
    meta?: Record<string | number | symbol, unknown>;
}

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: "home",
        element: <Home />,
        // element: (<><Home/><Navigate to="/home/:id" replace/></>),
        meta: {
            needAuth: false,
        },
    },
    {
        path: '*',
        name: "notfound",
        element: <NotFound />,
        meta: {
            title: "notfound",
            needAuth: false,
        },
    },
]
