const TitleComponent = ({ title }) => {
    return (
        React.createElement(
            'h1',
            { class: 'title' },
            title,
        )
    )
}

const TextComponent = ({ text }) => {
    return (
        React.createElement(
            'p',
            { class: 'text' },
            text,
        )
    )
}

const BtnComponent = () => {
    const [state, setState] = React.useState(0)

    const handleClick = () => setState(currentState => currentState + 1)

    const title = state === 0
        ? 'Click me'
        : `Сlicked ${state} times`

    return (
        React.createElement(
            'button',
            { class: 'button', onClick: handleClick },
            title,
        )
    )
}

const ImgComponent = () => {
    return (
        React.createElement(
            'img',
            { class: 'img', src: 'logo.svg' }
        )
    )
}

const App = props => {
    const { title, text, btnText } = props

    return (
        React.createElement(
            'div',
            { class: 'container' },
            React.createElement(ImgComponent),
            React.createElement(TitleComponent, { title: title }),
            React.createElement(TextComponent, { text: text }),
            React.createElement(BtnComponent),
        )
    )
}

const root = document.getElementById('app')

React.render(
    React.createElement(App, { title: 'React example', text: 'Click on the button to increase counter' }),
    root
)
