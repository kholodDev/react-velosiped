const App = props => {
    const { title, text } = props

    return (
        React.createElement(
            'div',
            { class: 'container' },
            React.createElement('h1', { class: 'title' }, title),
            React.createElement('p', { class: 'text' }, text),
        )
    )
}

const root = document.getElementById('app')

ReactDOM.render(App('Title', 'text'), root)
