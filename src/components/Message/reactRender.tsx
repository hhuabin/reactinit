import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'

// eslint-disable-next-line react-refresh/only-export-components
const MARK = '__rc_react_root__'

type ContainerType = (Element | DocumentFragment) & {
    [MARK]?: Root;
}

export type UnmountType = () => Promise<void>
export type RenderType = (
    node: React.ReactElement,
    container: Element | DocumentFragment,
) => UnmountType

/**
 * @descCN React 18 的 render 方法
 * @param node
 * @param container
 * @returns
 */
export const render = (node: React.ReactElement, container: ContainerType) => {
    const root = container[MARK] || createRoot(container)

    root.render(node)

    container[MARK] = root
}

export const unmount = async (container: ContainerType) => {
    // Delay to unmount to avoid React 18 sync warning
    return Promise.resolve().then(() => {
        container[MARK]?.unmount()

        delete container[MARK]
    })
}

export const defaultReactRender: RenderType = (node: React.ReactElement, container: Element | DocumentFragment) => {
    render(node, container)

    return () => unmount(container)
}

let unstableRender: RenderType = defaultReactRender

export function unstableSetRender(render?: RenderType) {
    if (render) {
        unstableRender = render
    }
    return unstableRender
}
