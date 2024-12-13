import type { PublicParam, PublicAnswer } from './public'

export type LoginParam = PublicParam & {
    username: string
    password: string
}
