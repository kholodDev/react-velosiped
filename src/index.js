const App = React.createElement(
    'div',
    { class: 'container' },
    React.createElement(
        'h1',
        { class: 'title' },
        'Title'
    ),
    React.createElement(
        'p',
        { class: 'text' },
        'Text'
    ),
)

const root = document.getElementById('app')

ReactDOM.render(App, root)
