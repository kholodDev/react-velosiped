/**
 * Основано на React v16.8
 * Источник: https://pomb.us/build-your-own-react
 */

// eslint-disable-next-line no-unused-vars
const React = (() => {
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
                children: children.map(child => {
                    if (typeof child === 'object') {
                        return child
                    }

                    return createTextElement(child)
                }),
            },
        }
    }

    return {
        createElement,
    }
})()

