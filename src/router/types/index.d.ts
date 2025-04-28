import type { RouteObject } from 'react-router-dom'

export type RouteConfig = RouteObject & {
    children?: RouteConfig[];
    meta?: Record<string | number | symbol, unknown>;
}
