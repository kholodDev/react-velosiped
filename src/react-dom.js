/**
 * Основано на React v16.8
 * Источник: https://pomb.us/build-your-own-react
 */

// eslint-disable-next-line no-unused-vars
const ReactDOM = (() => {
    // Создание DOM ноды
    function createElement(type) {
        if (type === 'TEXT_ELEMENT') {
            return document.createTextNode('')
        }

        return document.createElement(type)
    }

    function isNativeAttribute(name) {
        const nativeAttributeNames = ['class']
        return nativeAttributeNames.includes(name)
    }

    function render({ type, props }, container) {
        const dom = createElement(type)

        // Добавление атрибутов props
        Object
            .keys(props)
            .filter(key => key !== 'children')
            .forEach(name => {
                if (isNativeAttribute(name)) {
                    dom.setAttribute(name, props[name])
                } else {
                    dom[name] = props[name]
                }
            })

        props.children.forEach(child => {
            render(child, dom)
        })

        container.appendChild(dom)
    }

    return {
        render,
    }
})()

