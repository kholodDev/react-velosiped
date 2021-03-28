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

const BtnComponent = ({ onClick, title, disabled = false }) => {
    console.log(disabled);
    return (
        React.createElement(
            'button',
            { class: 'button', onClick, disabled },
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

const CounterComponent = ({ counter }) => {
    return (
        React.createElement(
            'p',
            { class: 'counter' },
            `< ${counter} >`
        )
    )
}

const ButtonsComponent = ({ onIncrease, onReset, disabledReset }) => {
    return (
        React.createElement(
            'div',
            { class: 'btns-container' },
            React.createElement(BtnComponent, { onClick: onIncrease, title: 'Increase'}),
            React.createElement(BtnComponent, { onClick: onReset, title: 'Reset', disabled: disabledReset }),
        )
    )
}

const App = ({ title, text }) => {
    const [state, setState] = React.useState(0)

    const handleIncrease = () => setState(currentState => currentState + 1)
    const handleReset = () => setState(0)

    return (
        React.createElement(
            'div',
            { class: 'container' },
            React.createElement(ImgComponent),
            React.createElement(TitleComponent, { title: title }),
            React.createElement(TextComponent, { text: text }),
            React.createElement(ButtonsComponent, { onIncrease: handleIncrease, onReset: handleReset, disabledReset: state === 0 }),
            state > 0 && React.createElement(CounterComponent, { counter: state }),
        )
    )
}


const root = document.getElementById('app')

React.render(
    React.createElement(App, { title: 'React example', text: 'Click on the button to increase counter' }),
    root
)
