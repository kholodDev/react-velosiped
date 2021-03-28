/**
 * Основано на React v16.8
 * Источник: https://pomb.us/build-your-own-react
 */

const React = (() => {
    const attributeNames = ['class']
    const booleanAttributeNames = ['disabled']

    let nextUnitOfWork = null
    let workInProgressTree = null
    let currentTree = null
    let deletions = null
    let hookIndex = null
    let workInProgressFiber = null

    function createTextElement(text = '') {
        return {
            type: 'TEXT_ELEMENT',
            props: {
                nodeValue: text,
                children: [],
            },
        }
    }

    function createElement(type = null, props = {}, ...children) {
        return {
            type,
            props: {
                ...props,
                children: children
                    .filter(Boolean)
                    .map(child => {
                    if (typeof child === 'object') {
                        return child
                    }

                    return createTextElement(child)
                }),
            },
        }
    }

    function useState(initialState) {
        const oldHook = 
            workInProgressFiber.alternate &&
            workInProgressFiber.alternate.hooks &&
            workInProgressFiber.alternate.hooks[hookIndex]

        const hook = {
            state: oldHook ? oldHook.state : initialState,
            queue: [],
        }

        const actions = oldHook ? oldHook.queue : []
        actions.forEach(action => {
            hook.state = action(hook.state)
        })

        const setState = action => {
            hook.queue.push(action instanceof Function ? action : () => action)
            
            workInProgressTree = {
                dom: currentTree.dom,
                props: currentTree.props,
                alternate: currentTree
            }

            nextUnitOfWork = workInProgressTree
            deletions = []

            startRender()
        }

        workInProgressFiber.hooks.push(hook)
        hookIndex++

        return [
            hook.state,
            setState
        ]
    }

    function setAttribute(dom, key, value) {
        if (key.startsWith('on')) {
            const eventType = key.toLowerCase().substring(2)
            dom.addEventListener(eventType, value)
        } else if (attributeNames.includes(key)) {
            dom.setAttribute(key, value)
        } else if (booleanAttributeNames.includes(key) && value === true) {
            dom.setAttribute(key, value)
        } else {
            dom[key] = value
        }
    }

    function removeAttribute(dom, key, value) {
        if (key.startsWith('on')) {
            const eventType = key.toLowerCase().substring(2)
            dom.removeEventListener(eventType, value)
        } else if (attributeNames.includes(key)) {
            dom.removeAttribute(key)
        } else if (booleanAttributeNames.includes(key) && value === false) {
            dom.removeAttribute(key)
        } else {
            dom[key] = ''
        }
    }

    function updateDOM(dom, prevProps, nextProps) {
        Object
            .keys(prevProps)
            .filter(key => key !== 'children')
            .filter(key => !(key in nextProps) || prevProps[key] !== nextProps[key])
            .forEach(key => removeAttribute(dom, key, prevProps[key]))

        Object
            .keys(nextProps)
            .filter(key => key !== 'children')
            .filter(key => prevProps[key] !== nextProps[key])
            .forEach(key => setAttribute(dom, key, nextProps[key]))
    }

    function commitDeletion(fiber, domParent) {
        if (fiber.dom) {
            domParent.removeChild(fiber.dom)
            fiber.parent.child = null
        } else {
            commitDeletion(fiber.child, domParent)
        }
    }

    function commitWork(fiber) {
        if (!fiber) {
            return null
        }

        let domParentFiber = fiber.parent
        while (!domParentFiber.dom) {
            domParentFiber = domParentFiber.parent
        }
        const domParent = domParentFiber.dom

        if (fiber.effectTag === 'PLACEMENT' && fiber.dom) {
            domParent.appendChild(fiber.dom)
        } else if (fiber.effectTag === 'UPDATE' && fiber.dom) {
            updateDOM(fiber.dom, fiber.alternate.props, fiber.props)
        } else if (fiber.effectTag === 'DELETION') {
            commitDeletion(fiber, domParent)
        }

        commitWork(fiber.child)
        commitWork(fiber.sibling)
    }

    function commitTree() {
        deletions.forEach(commitWork)
        commitWork(workInProgressTree.child)
        currentTree = workInProgressTree
        workInProgressTree = null
    }

    function createDOMElement(type) {
        if (type === 'TEXT_ELEMENT') {
            return document.createTextNode('')
        }

        return document.createElement(type)
    }

    function createDOM(fiber) {
        const { type, props } = fiber
        const dom = createDOMElement(type)

        Object
            .keys(props)
            .filter(key => key !== 'children')
            .forEach(key => setAttribute(dom, key, props[key]))

        return dom
    }

    function reconcileChildren(fiber, elements) {
        let idx = 0
        let oldFiber = fiber.alternate && fiber.alternate.child
        let prevSibling = null

        while (idx < elements.length || oldFiber != null) {
            const elem = elements[idx]
            let newFiber = null

            const sameType = oldFiber && elem && elem.type === oldFiber.type

            if (sameType) {
                newFiber = {
                    type: oldFiber.type,
                    props: elem.props,
                    dom: oldFiber.dom,
                    parent: fiber,
                    alternate: oldFiber,
                    effectTag: 'UPDATE',
                }
            }

            if (elem && !sameType) {
                newFiber = {
                    type: elem.type,
                    props: elem.props,
                    dom: null,
                    parent: fiber,
                    alternate: null,
                    effectTag: 'PLACEMENT',
                }
            }

            if (oldFiber && !sameType) {
                oldFiber.effectTag = 'DELETION'
                deletions.push(oldFiber)
            }

            if (oldFiber) {
                oldFiber = oldFiber.sibling
            }

            if (idx === 0) {
                fiber.child = newFiber
            } else {
                prevSibling.sibling = newFiber
            }

            prevSibling = newFiber
            idx++
        }
    }

    function updateFunctionComponent(fiber) {
        workInProgressFiber = fiber
        hookIndex = 0
        workInProgressFiber.hooks = []
        const children = [fiber.type(fiber.props)]
        reconcileChildren(fiber, children)
    }

    function updateHostComponent(fiber) {
        if (!fiber.dom) {
            fiber.dom = createDOM(fiber)
        }

        const children = fiber.props.children
        reconcileChildren(fiber, children)
    }

    function performUnitOfWork(fiber) {
        const isFunctionalComponent = fiber.type instanceof Function

        if (isFunctionalComponent) {
            updateFunctionComponent(fiber)
        } else {
            updateHostComponent(fiber)
        }

        if (fiber.child) {
            return fiber.child
        }

        let nextFiber = fiber

        while (nextFiber) {
            if (nextFiber.sibling) {
                return nextFiber.sibling
            }

            nextFiber = nextFiber.parent
        }

        return null
    }

    function startRender() {
        requestIdleCallback(workLoop)
    }

    function workLoop(deadline) {
        let shouldYield = false

        while (nextUnitOfWork && !shouldYield) {
            nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
            shouldYield = deadline.timeRemaining() < 1
        }

        if (!nextUnitOfWork && workInProgressTree) {
            commitTree()
        } else {
            startRender()
        }
    }

    function render(element, container) {
        workInProgressTree = {
            dom: container,
            props: {
                children: [element],
            },
            alternate: currentTree,
        }

        deletions = []

        nextUnitOfWork = workInProgressTree

        startRender()
    }

    return {
        createElement,
        render,
        useState
    }
})()

