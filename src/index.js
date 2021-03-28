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

const BtnComponent = ({ title }) => {
    const handleClick = () => {
        alert('Button has been clicked!');
    }

    return (
        React.createElement(
            'button',
            { class: 'button', onClick: handleClick },
            title,
        )
    )
}

const App = props => {
    const { title, text, btnText } = props

    return (
        React.createElement(
            'div',
            { class: 'container' },
            React.createElement(TitleComponent, { title: title }),
            React.createElement(TextComponent, { text: text }),
            React.createElement(BtnComponent, { title: btnText }),
        )
    )
}

const root = document.getElementById('app')

ReactDOM.render(
    React.createElement(App, { title: 'Title', text: 'text', btnText: 'click me!' }),
    root
)
