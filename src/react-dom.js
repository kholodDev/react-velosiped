/**
 * Основано на React v16.8
 * Источник: https://pomb.us/build-your-own-react
 */
/* eslint-disable consistent-return, max-lines-per-function */
// eslint-disable-next-line no-unused-vars
const ReactDOM = (() => {
    let nextUnitOfWork = null
    let workInProgressTree = null
    let currentTree = null
    let deletions = null

    function isNativeAttribute(name) {
        const nativeAttributeNames = ['class']
        return nativeAttributeNames.includes(name)
    }

    function updateDOM(dom, prevProps, nextProps) {
        Object
            .keys(prevProps)
            .filter(key => key.startsWith('on'))
            .filter(key => !(key in nextProps) || prevProps[key] !== nextProps[key])
            .forEach(key => {
                const eventType = key.toLowerCase().substring(2)
                dom.removeEventListener(eventType, prevProps[key])
            })

        Object
            .keys(prevProps)
            .filter(key => key.startsWith('on'))
            .filter(key => prevProps[key] !== nextProps[key])
            .forEach(key => {
                const eventType = key.toLowerCase().substring(2)
                dom.addEventListener(eventType, prevProps[key])
            })

        Object
            .keys(prevProps)
            .filter(key => key !== 'children' && !key.startsWith('on'))
            .filter(key => !(key in nextProps))
            .forEach(key => {
                if (isNativeAttribute(key)) {
                    dom.setAttribute(key, '')
                } else {
                    dom[key] = ''
                }
            })

        Object
            .keys(nextProps)
            .filter(key => key !== 'children')
            .filter(key => prevProps[key] !== nextProps[key])
            .forEach(key => {
                if (isNativeAttribute(key)) {
                    dom.setAttribute(key, nextProps[key])
                } else {
                    dom[key] = nextProps[key]
                }
            })
    }

    function commitDeletion(fiber, domParent) {
        if (fiber.dom) {
            domParent.removeChild(fiber.dom)
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

        if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {
            domParent.appendChild(fiber.dom)
        } else if (fiber.effectTag === 'UPDATE' && fiber.dom !== null) {
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
            .forEach(key => {
                if (isNativeAttribute(key)) {
                    dom.setAttribute(key, props[key])
                } else {
                    dom[key] = props[key]
                }
            })

        return dom
    }

    function reconcileChildren(fiber, elements) {
        let idx = 0
        let oldFiber = workInProgressTree.alternate && workInProgressTree.alternate.child
        let prevSibling = null

        while (idx < elements.length || oldFiber !== null) {
            const elem = elements[idx]
            let newFiber = null

            const sameType = oldFiber && elem && elem.type === oldFiber.type

            if (sameType) {
                newFiber = {
                    type: oldFiber.type,
                    props: oldFiber.props,
                    dom: oldFiber.dom,
                    parent: workInProgressTree,
                    alternate: oldFiber,
                    effectTag: 'UPDATE',
                }
            }

            if (elem && !sameType) {
                newFiber = {
                    type: elem.type,
                    props: elem.props,
                    dom: null,
                    parent: workInProgressTree,
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

    function workLoop(deadline) {
        let shouldYield = false

        while (nextUnitOfWork && !shouldYield) {
            nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
            shouldYield = deadline.timeRemaining() < 1
        }

        if (!nextUnitOfWork && workInProgressTree) {
            commitTree()
        } else {
            requestIdleCallback(workLoop)
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

        requestIdleCallback(workLoop)
    }

    return {
        render,
    }
})()
